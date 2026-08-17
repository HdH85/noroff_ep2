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
    public class WorkHoursController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public WorkHoursController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        /// <summary>
        /// Retrieves all work hours.
        /// </summary>
        /// <response code="200">Returns a complete list of all work hours</response>
        /// <response code="404">If response value is null</response>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<WorkHours>>> GetAllWorkHours()
        {
            if (_dataContext.WorkHours == null)
            {
                return NotFound();
            }

            return await _dataContext.WorkHours.ToListAsync();
        }

        /// <summary>
        /// Retrieves a single specified work hour table entry.
        /// </summary>
        /// <response code="200">Returns a single specific work hour range</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("{Id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<WorkHours>> GetWorkHours(int Id)
        {
            if (_dataContext.WorkHours == null)
            {
                return NotFound();
            }

            var workHour = await _dataContext.WorkHours
                .Include(d => d.Doctor)
                .Include(s => s.Location)
                .FirstOrDefaultAsync(d => d.Id == Id);
                
            if (workHour is null)
            {
                return NotFound();
            }

            return workHour;
        }

        /// <summary>
        /// Adds a new work hours entry to the database.
        /// </summary>
        /// <remarks>
        ///     POST /api/workhours
        ///     {
        ///         "doctorId": 3,
        ///         "locationId": 2,
        ///         "dayOfWeek": 1,
        ///         "startTime": "08:00:00",
        ///         "endTime": "16:00:00",
        ///         "appointmentTime": 30
        ///     }
        /// </remarks>
        /// <response code="201">Returns newly addded work hours</response>
        /// <response code="400">If response value is null</response>
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<WorkHours>> AddWorkHours(WorkHours workHours)
        {
            var doctor = await _dataContext.Doctors
                .FirstOrDefaultAsync(i => i.Id == workHours.DoctorId);

            if (doctor == null) return NotFound("Doctor not found.");
            
            if (doctor.LocationId != workHours.LocationId)
            {
                return BadRequest("Doctor location mismatch!");
            }

            _dataContext.WorkHours.Add(workHours);
            await _dataContext.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWorkHours), new { id = workHours.Id }, workHours);
        }

        /// <summary>
        /// Updates information for a specific work hours entry.
        /// </summary>
        /// <remarks>
        ///     PUT /api/workhours/5
        ///     {
        ///         "id": 5,
        ///         "doctorId": 3,
        ///         "locationId": 2,
        ///         "dayOfWeek": 1,
        ///         "startTime": "09:00:00",
        ///         "endTime": "17:00:00"
        ///     }
        /// </remarks>
        /// <response code="204">No content returned on successful update</response>
        /// <response code="400">If response value is null</response>
        [HttpPut("{Id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<WorkHours>> UpdateWorkHours(int Id, WorkHours workHours)
        {
            if (Id != workHours.Id)
            {
                return BadRequest();
            }

            var doctor = await _dataContext.Doctors
                .FirstOrDefaultAsync(i => i.Id == workHours.DoctorId);

            if (doctor == null) return NotFound("Doctor not found.");
            
            if (doctor.LocationId != workHours.LocationId)
            {
                return BadRequest("Doctor location mismatch!");
            }

            _dataContext.Update(workHours);
            try
            {
                await _dataContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkHoursExists(Id))
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
        /// Removes a work hours entry from the database.
        /// </summary>
        /// <response code="204">No content returned on successful deletion</response>
        /// <response code="400">If response value is null</response>
        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<WorkHours>> DeleteWorkHours(int Id)
        {
            if (_dataContext.WorkHours == null)
            {
                return NotFound();
            }

            var workHours = await _dataContext.WorkHours.FindAsync(Id);

            if (workHours is null)
            {
                return NotFound();
            }

            _dataContext.WorkHours.Remove(workHours);
            await _dataContext.SaveChangesAsync();
            return NoContent();
        }

        private bool WorkHoursExists(int id)
        {
            return (_dataContext.WorkHours?.Any(WorkHours => WorkHours.Id == id)).GetValueOrDefault();
        }
    }
}
