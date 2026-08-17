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
    public class AppointmentController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly AppointmentService _appointmentService;

        public AppointmentController(DataContext dataContext, AppointmentService appointmentService)
        {
            _dataContext = dataContext;
            _appointmentService = appointmentService;
        }

        /// <summary>
        /// Retrieves all appointments.
        /// </summary>
        /// <response code="200">Returns a complete list of all appointments</response>
        /// <response code="404">If response value is null</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
        {
            if (_dataContext.Appointments == null)
            {
                return NotFound();
            }

            return await _dataContext.Appointments
                .Include(p => p.Patient)
                .Include(d => d.Doctor)
                .Include(l => l.Location)
                .ToListAsync();
        }

        /// <summary>
        /// Retrieves all available appointment slots.
        /// </summary>
        /// <response code="200">Returns a list of all available appointment slots</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("available-slots")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetAvailableSlots(
            [FromQuery] int doctorId, 
            [FromQuery] DateOnly date)
        {
            var slots = await _appointmentService.FetchAvailableSlotsAsync(doctorId, date);

            return Ok(slots);
        }

        /// <summary>
        /// Retrieves all appointments belonging to a certain patients unique ID.
        /// </summary>
        /// <response code="200">Returns a list of all appointments belonging to the patient ID</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("patient/{PatientId}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Appointment>>> GetMyAppointments(int patientId)
        {
            var appointments = await _dataContext.Appointments
                .Where(p => p.PatientId == patientId)
                .Include(d => d.Doctor)
                .Include(l => l.Location)
                .ToListAsync();

            if (appointments == null)
            {
                return NotFound($"No appointments found for patient {patientId}.");
            }

            return appointments;
        }

        /// <summary>
        /// Retrieves a single specific appointment.
        /// </summary>
        /// <response code="200">Returns a single specific appointment</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("{Id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Appointment>> GetAppointment(int Id)
        {
            if (_dataContext.Appointments == null)
            {
                return NotFound();
            }

            var appointment = await _dataContext.Appointments
                .Include(p => p.Patient)
                .Include(d => d.Doctor)
                .Include(l => l.Location)
                .FirstOrDefaultAsync(d => d.Id == Id);

            if (appointment is null)
            {
                return NotFound("No appointment found matching your criteria.");
            }

            return appointment;
        }

        /// <summary>
        /// Adds a new appointment entry to the database.
        /// </summary>
        /// <remarks>
        ///     POST /api/appointment/book
        ///     {
        ///         "patientId": 5,
        ///         "locationId": 2,
        ///         "doctorId": 3,
        ///         "start": "2026-06-15T10:00:00Z",
        ///         "description": "Annual checkup"
        ///     }
        /// </remarks>
        /// <response code="201">Returns a newly addded appointment</response>
        /// <response code="400">If response value is null</response>
        /// /// <response code="409">If the appointment time is already taken</response>
        [HttpPost("book")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<Appointment>> BookAppointment([FromBody] BookingDTO bookingDto)
        {
            try
            {
                var appointment = await _appointmentService.BookAppointmentAsync(bookingDto);
                return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(ex.Message);
            }
        }

        /// <summary>
        /// Updates information for an appointment.
        /// </summary>
        /// <remarks>
        ///     PUT /api/appointment/1
        ///     {
        ///         "id": 1,
        ///         "patientId": 5,
        ///         "doctorId": 3,
        ///         "locationId": 2,
        ///         "start": "2026-06-15T14:00:00Z",
        ///         "end": "2026-06-15T14:15:00Z",
        ///         "description": "Follow-up appointment"
        ///     }
        /// </remarks>
        /// <response code="204">No content returned on successful update</response>
        /// <response code="400">If response value is null</response>
        /// /// <response code="409">If the new appointment time is already taken</response>
        [HttpPut("{Id:int}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<Appointment>> UpdateAppointment(int Id, Appointment appointment)
        {
            if (Id != appointment.Id)
            {
                return BadRequest();
            }

            var workHours = await _dataContext.WorkHours
                .Where(w => w.DoctorId == appointment.DoctorId && 
                    w.LocationId == appointment.LocationId &&
                    w.DayOfWeek == appointment.Start.DayOfWeek)
                 .FirstOrDefaultAsync();

            if (workHours == null)
            {
                return BadRequest("No work hours found for the selected doctor.");
            }

            appointment.End = appointment.Start.AddMinutes(workHours.AppointmentTime);

            if (await _appointmentService.AppointmentIsTakenAsync(appointment))
            {
                return Conflict("Appointment time already taken.");
            }

            _dataContext.Update(appointment);

            try
            {
                await _dataContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _appointmentService.AppointmentExistsAsync(Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch(DbUpdateException)
            {
                return Conflict("Appointment slot taken");
            }

            return NoContent();
        }

        /// <summary>
        /// Removes an appointment from the database.
        /// </summary>
        /// <response code="204">No content returned on successful deletion</response>
        /// <response code="400">If response value is null</response>
        [HttpDelete("{Id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Appointment>> DeleteAppointment(int Id)
        {
            if (_dataContext.Appointments == null)
            {
                return NotFound();
            }

            var appointment = await _dataContext.Appointments.FindAsync(Id);

            if (appointment is null)
            {
                return NotFound();
            }

            _dataContext.Appointments.Remove(appointment);
            await _dataContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
