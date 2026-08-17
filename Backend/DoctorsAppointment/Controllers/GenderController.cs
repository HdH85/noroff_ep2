using DoctorsAppointment.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoctorsAppointment.Data;
using Microsoft.AspNetCore.Authorization;
using Mysqlx.Notice;
using MySqlX.XDevAPI.Common;
using Org.BouncyCastle.Tls;

namespace DoctorsAppointment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class GenderController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public GenderController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        /// <summary>
        /// Retrieves all genders.
        /// </summary>
        /// <response code="200">Returns a complete list of all genders</response>
        /// <response code="404">If response value is null</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Gender>>> GetGender()
        {
            if (_dataContext.Genders == null)
            {
                return NotFound();
            }

            return await _dataContext.Genders.ToListAsync();
        }

        /// <summary>
        /// Retrieves a single specific gender.
        /// </summary>
        /// <response code="200">Returns a single specific gender</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Gender>> GetGender(int Id)
        {
            if (_dataContext.Genders == null)
            {
                return NotFound();
            }

            var gender = await _dataContext.Genders.FirstOrDefaultAsync(d => d.Id == Id);

            if (gender is null)
            {
                return NotFound();
            }

            return gender;
        }

        /// <summary>
        /// Adds a new gender entry to the database.
        /// </summary>
        /// <remarks>
        ///     POST /api/gender
        ///     {
        ///         "name": "Non-binary"
        ///     }
        /// </remarks>
        /// <response code="201">Returns a newly addded gender</response>
        /// <response code="400">If response value is null</response>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Gender>> AddSpecialty(Gender gender)
        {
            _dataContext.Genders.Add(gender);
            await _dataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetGender), new { id = gender.Id }, gender);
        }

        /// <summary>
        /// Updates information for a gender.
        /// </summary>
        /// <remarks>
        ///     PUT /api/gender/3
        ///     {
        ///         "id": 3,
        ///         "name": "Other"
        ///     }
        /// </remarks>
        /// <response code="204">No content returned on successful update</response>
        /// <response code="400">If response value is null</response>
        [HttpPut("{Id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Gender>> UpdateGender(int Id, Gender gender)
        {
            if (Id != gender.Id)
            {
                return BadRequest();
            }

            var hasGender = await _dataContext.Patients
                .Include(g => g.GenderId)
                .AnyAsync();

            if(hasGender)
            {
                return Ok(new
                {
                    Warning = "One or more patients are assigned to this gender."
                });
            }

            _dataContext.Update(gender);
            try
            {
                await _dataContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GenderExists(Id))
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
        /// Removes a gender from the database.
        /// </summary>
        /// <response code="204">No content returned on successful deletion</response>
        /// <response code="400">If response value is null</response>
        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Gender>> DeleteGender(int Id)
        {
            if (_dataContext.Genders == null)
            {
                return NotFound();
            }

            var hasGender = await _dataContext.Patients
                .Include(g => g.GenderId)
                .AnyAsync();

            if(hasGender)
            {
                return BadRequest("Can't delete! Gender currently assigned to one or more patients.");
            }

            var gender = await _dataContext.Genders.FindAsync(Id);

            if (gender is null)
            {
                return NotFound();
            }

            _dataContext.Genders.Remove(gender);
            await _dataContext.SaveChangesAsync();
            return NoContent();
        }

        private bool GenderExists(int id)
        {
            return (_dataContext.Genders?.Any(gender => gender.Id == id)).GetValueOrDefault();
        }
    }
}
