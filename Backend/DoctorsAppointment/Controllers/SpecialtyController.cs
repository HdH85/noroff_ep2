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
    public class SpecialtyController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public SpecialtyController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        /// <summary>
        /// Retrieves all specialties.
        /// </summary>
        /// <response code="200">Returns a complete list of all specialties</response>
        /// <response code="404">If response value is null</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Specialty>>> GetSpecialties()
        {
            if (_dataContext.Specialties == null)
            {
                return NotFound();
            }

            return await _dataContext.Specialties.ToListAsync();
        }

        /// <summary>
        /// Retrieves a single specific specialty.
        /// </summary>
        /// <response code="200">Returns a single specific specialty</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Specialty>> GetSpecialty(int Id)
        {
            if (_dataContext.Specialties == null)
            {
                return NotFound();
            }

            var specialty = await _dataContext.Specialties
                .Include(d => d.Doctors)
                .FirstOrDefaultAsync(d => d.Id == Id);
            if (specialty is null)
            {
                return NotFound();
            }

            return specialty;
        }

        /// <summary>
        /// Adds a new specialty entry to the database.
        /// </summary>
        /// <remarks>
        ///     POST /api/specialty
        ///     {
        ///         "name": "Cardiology"
        ///     }
        /// </remarks>
        /// <response code="201">Returns a newly addded specialty</response>
        /// <response code="400">If response value is null</response>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Specialty>> AddSpecialty(Specialty specialty)
        {
            _dataContext.Specialties.Add(specialty);
            await _dataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSpecialty), new { id = specialty.Id }, specialty);
        }

        /// <summary>
        /// Updates information for a specialty.
        /// </summary>
        /// <remarks>
        ///     PUT /api/specialty/1
        ///     {
        ///         "id": 1,
        ///         "name": "Pediatric Cardiology"
        ///     }
        /// </remarks>
        /// <response code="204">No content returned on successful update</response>
        /// <response code="400">If response value is null</response>
        [HttpPut("{Id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Specialty>> UpdateSpecialty(int Id, Specialty specialty)
        {
            if (Id != specialty.Id)
            {
                return BadRequest();
            }

            var hasSpecialty = await _dataContext.Doctors
                .Include(g => g.SpecialtyId)
                .AnyAsync();

            if(hasSpecialty)
            {
                return Ok(new
                {
                    Warning = "One or more doctors are assigned to this specialty."
                });
            }

            _dataContext.Update(specialty);
            try
            {
                await _dataContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SpecialtyExists(Id))
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
        /// Removes a specialty from the database.
        /// </summary>
        /// <response code="204">No content returned on successful deletion</response>
        /// <response code="400">If response value is null</response>
        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Specialty>> DeleteSpecialty(int Id)
        {
            if (_dataContext.Specialties == null)
            {
                return NotFound();
            }

            var hasSpecialty = await _dataContext.Doctors
                .Include(g => g.SpecialtyId)
                .AnyAsync();

            if (hasSpecialty)
            {
                return BadRequest("Can't delete! Specialty currently assigned to one or more doctors.");
            }

            var specialty = await _dataContext.Specialties.FindAsync(Id);

            if (specialty is null)
            {
                return NotFound();
            }

            _dataContext.Specialties.Remove(specialty);
            await _dataContext.SaveChangesAsync();
            return NoContent();
        }

        private bool SpecialtyExists(int id)
        {
            return (_dataContext.Specialties?.Any(specialty => specialty.Id == id)).GetValueOrDefault();
        }
    }
}
