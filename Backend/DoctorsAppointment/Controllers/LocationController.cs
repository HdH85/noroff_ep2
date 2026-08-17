using DoctorsAppointment.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoctorsAppointment.Data;
using Microsoft.AspNetCore.Authorization;

namespace DoctorsAppointment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class LocationController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public LocationController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        /// <summary>
        /// Retrieves all locations.
        /// </summary>
        /// <response code="200">Returns a complete list of all locations</response>
        /// <response code="404">If response value is null</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Location>>> GetLocations()
        {
            if (_dataContext.Locations == null)
            {
                return NotFound();
            }

            return await _dataContext.Locations
                .Include(d => d.Doctors)
                    .ThenInclude(s => s.Specialty)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a single specific location.
        /// </summary>
        /// <response code="200">Returns a single specific location</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Location>> GetLocation(int Id)
        {
            if (_dataContext.Locations == null)
            {
                return NotFound();
            }

            var location = await _dataContext.Locations
                .Include(d => d.Doctors)
                .FirstOrDefaultAsync(d => d.Id == Id);
            if (location is null)
            {
                return NotFound();
            }

            return location;
        }

        /// <summary>
        /// Adds a new location entry to the database.
        /// </summary>
        /// <remarks>
        ///     POST /api/location
        ///     {
        ///         "name": "Downtown Medical Center",
        ///         "address": "Løkkeveien 51, 4008 Stavanger",
        ///         "imageUrl": "https://www.stavangersentrum.no/uploads/1368/0/%C3%98sterva%CC%8Ag%206.png"
        ///     }
        /// </remarks>
        /// <response code="201">Returns a newly addded location</response>
        /// <response code="400">If response value is null</response>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Location>> AddLocation(Location location)
        {
            _dataContext.Locations.Add(location);
            await _dataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetLocation), new { id = location.Id }, location);
        }

        /// <summary>
        /// Updates information for a location.
        /// </summary>
        /// <remarks>
        ///     PUT /api/location/2
        ///     {
        ///         "id": 2,
        ///         "name": "Uptown Medical Center",
        ///         "address": "Løkkeveien 51, 4008 Stavanger",
        ///         "imageUrl": "https://www.stavangersentrum.no/uploads/1368/0/%C3%98sterva%CC%8Ag%206.png"
        ///     }
        /// </remarks>
        /// <response code="204">No content returned on successful update</response>
        /// <response code="400">If response value is null</response>
        [HttpPut("{Id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Location>> UpdateLocation(int Id, Location location)
        {
            if (Id != location.Id)
            {
                return BadRequest();
            }

            _dataContext.Update(location);
            try
            {
                await _dataContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LocationExists(Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        /// <summary>
        /// Removes a location from the database.
        /// Will also remove any associated work hours.
        /// </summary>
        /// <response code="204">No content returned on successful deletion</response>
        /// <response code="400">If response value is null</response>
        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Location>> DeleteLocation(int Id)
        {
            if (_dataContext.Locations == null)
            {
                return NotFound();
            }

            var location = await _dataContext.Locations
                .Include(a => a.Appointments)
                .FirstOrDefaultAsync(d => d.Id == Id);

            if (location is null)
            {
                return NotFound();
            }

            if (location.Appointments != null && location.Appointments.Count > 0)
            {
                return BadRequest("Unable to delete entry because of appointments linked to it.");
            }

            _dataContext.Locations.Remove(location);
            await _dataContext.SaveChangesAsync();
            return NoContent();
        }

        private bool LocationExists(int id)
        {
            return (_dataContext.Locations?.Any(location => location.Id == id)).GetValueOrDefault();
        }
    }
}
