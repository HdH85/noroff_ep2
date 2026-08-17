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
    public class DocController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public DocController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        /// <summary>
        /// Retrieves all doctors
        /// </summary>
        /// <response code="200">Returns a complete list of all doctors</response>
        /// <response code="404">If response value is null</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDocs()
        {
            if (_dataContext.Doctors == null)
            {
                return NotFound();
            }

            return await _dataContext.Doctors
                .Include(r => r.Specialty)
                .Include(t => t.Location)
                .Include(w => w.WorkHours)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves a single specific doctor.
        /// </summary>
        /// <response code="200">Returns a single specific doctor</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Doctor>> GetDoc(int Id)
        {
            if (_dataContext.Doctors == null)
            {
                return NotFound();
            }

            var doc = await _dataContext.Doctors
                .Include(r => r.Specialty)
                .Include(t => t.Location)
                .Include(w => w.WorkHours)
                .FirstOrDefaultAsync(d => d.Id == Id);
            if (doc is null)
            {
                return NotFound();
            }

            return doc;
        }

        /// <summary>
        /// Adds a new doctor entry to the database.
        /// </summary>
        /// <remarks>
        ///     POST /api/doc
        ///     {
        ///         "firstname": "Jane",
        ///         "lastname": "Smith",
        ///         "imageUrl": "",
        ///         "specialtyId": 1,
        ///         "locationId": 2
        ///     }
        /// </remarks>
        /// <response code="201">Returns a newly addded doctor</response>
        /// <response code="400">If response value is null</response>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Doctor>> AddDoc(Doctor doctor)
        {
            _dataContext.Doctors.Add(doctor);
            await _dataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetDoc), new { id = doctor.Id }, doctor);
        }

        /// <summary>
        /// Updates information for a doctor.
        /// </summary>
        /// <remarks>
        ///     PUT /api/doc/3
        ///     {
        ///         "id": 3,
        ///         "firstname": "Jane",
        ///         "lastname": "Smith-Williams",
        ///         "imageUrl": "",
        ///         "specialtyId": 2,
        ///         "locationId": 3
        ///     }
        /// </remarks>
        /// <response code="204">No content returned on successful update</response>
        /// <response code="400">If response value is null</response>
        [HttpPut("{Id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Doctor>> UpdateDoc(int Id, Doctor doctor)
        {
            var existingDoctor = await _dataContext.Doctors.AsNoTracking().FirstOrDefaultAsync(i => i.Id == Id);

            if (existingDoctor == null)
            {
                return NotFound();
            }

            var hasWorkHours = await _dataContext.WorkHours
                .AnyAsync(i => i.DoctorId == Id);

            if (existingDoctor.LocationId != doctor.LocationId && hasWorkHours)
            {
                return BadRequest("Can't change doctor location, doctor has existing work hours.");
            }

            _dataContext.Update(doctor);
            try
            {
                await _dataContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DocExists(Id))
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
        /// Removes a doctor from the database.
        /// Will also remove any associated work hours.
        /// </summary>
        /// <response code="204">No content returned on successful deletion</response>
        /// <response code="400">If response value is null</response>
        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Doctor>> DeleteDoc(int Id)
        {
            if (_dataContext.Doctors == null)
            {
                return NotFound();
            }

            var doc = await _dataContext.Doctors
                .Include(a => a.Appointments)
                .FirstOrDefaultAsync(d => d.Id == Id);

            if (doc is null)
            {
                return NotFound();
            }

            if (doc.Appointments != null && doc.Appointments.Count > 0)
            {
                return BadRequest("Unable to delete entry because of appointments linked to it.");
            }

            _dataContext.Doctors.Remove(doc);
            await _dataContext.SaveChangesAsync();
            return NoContent();
        }

        private bool DocExists(int id)
        {
            return (_dataContext.Doctors?.Any(doctor => doctor.Id == id)).GetValueOrDefault();
        }
    }
}
