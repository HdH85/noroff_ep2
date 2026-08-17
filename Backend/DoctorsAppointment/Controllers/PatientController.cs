using DoctorsAppointment.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoctorsAppointment.Data;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using ZstdSharp.Unsafe;

namespace DoctorsAppointment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class PatientController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public PatientController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        /// <summary>
        /// Retrieves all patients.
        /// </summary>
        /// <response code="200">Returns a complete list of all patients</response>
        /// <response code="404">If response value is null</response>
        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            if (_dataContext.Patients == null)
            {
                return NotFound();
            }

            return await _dataContext.Patients.ToListAsync();
        }

        /// <summary>
        /// Retrieves a single specific patient.
        /// </summary>
        /// <response code="200">Returns a single specific patient</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("{Id}")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Patient>> GetPatient(int Id)
        {
            if (_dataContext.Patients == null)
            {
                return NotFound();
            }

            var patient = await _dataContext.Patients
                .Include(a => a.Appointments)
                    .ThenInclude(d => d.Doctor)
                .Include(a => a.Appointments)
                    .ThenInclude(l => l.Location)
                .Include(g => g.Gender)
                .FirstOrDefaultAsync(d => d.Id == Id);
            if (patient is null)
            {
                return NotFound();
            }

            return patient;
        }

        /// <summary>
        /// Adds a new patient entry to the database.
        /// </summary>
        /// <remarks>
        ///     POST /api/patient
        ///     {
        ///         "email": "john.doe@email.com",
        ///         "firstname": "John",
        ///         "lastname": "Doe",
        ///         "genderId": 1,
        ///         "role": "User",
        ///         "ssn": "12345678901",
        ///         "birthdate": "1990-05-15",
        ///         "Taxnumber": "39287-0918234507",
        ///         "Religion": "Humanist",
        ///         "DriversLicenseNumber": "90812345bj123598",
        ///         "MedicalInsuranceNumber": "787487-8904735-23"
        ///     }
        /// </remarks>
        /// <response code="201">Returns a newly addded patient</response>
        /// <response code="400">If response value is null</response>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<Patient>> AddPatient([FromBody] PatientRegisterDTO patientRegisterDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var existingPatient = await _dataContext.Patients
                .FirstOrDefaultAsync(e => e.Email == patientRegisterDTO.Email);

            if (existingPatient != null && existingPatient.Role == "User")
            {
                return Conflict("User already exists!");
            }
            else if (existingPatient != null && existingPatient.Role == "Guest")
            {
                existingPatient.Firstname = patientRegisterDTO.Firstname;
                existingPatient.Lastname = patientRegisterDTO.Lastname;
                existingPatient.Email = patientRegisterDTO.Email;
                existingPatient.GenderId = patientRegisterDTO.GenderId;
                existingPatient.Ssn = patientRegisterDTO.Ssn;
                existingPatient.Birthdate = patientRegisterDTO.Birthdate;
                existingPatient.TaxNumber = patientRegisterDTO.TaxNumber;
                existingPatient.Religion = patientRegisterDTO.Religion;
                existingPatient.DriversLicenseNumber = patientRegisterDTO.DriversLicenseNumber;
                existingPatient.MedicalInsuranceNumber = patientRegisterDTO.MedicalInsuranceNumber;
                existingPatient.Role = "User";

                await _dataContext.SaveChangesAsync();

                return Ok(existingPatient);
            } 
            else
            {
                var patient = new Patient
                {
                    Firstname = patientRegisterDTO.Firstname,
                    Lastname = patientRegisterDTO.Lastname,
                    Email = patientRegisterDTO.Email,
                    GenderId = patientRegisterDTO.GenderId,
                    Ssn = patientRegisterDTO.Ssn,
                    Birthdate = patientRegisterDTO.Birthdate,
                    TaxNumber = patientRegisterDTO.TaxNumber,
                    Religion = patientRegisterDTO.Religion,
                    DriversLicenseNumber = patientRegisterDTO.DriversLicenseNumber,
                    MedicalInsuranceNumber = patientRegisterDTO.MedicalInsuranceNumber,
                    Role = "User"
                };

                _dataContext.Patients.Add(patient);
                await _dataContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPatient), new { id = patient.Id}, patient);
            }
        }

        /// <summary>
        /// Adds a new "guest" patient entry to the database.
        /// </summary>
        /// <remarks>
        ///     POST /api/patient/guest
        ///     {
        ///         "firstname": "Jane",
        ///         "lastname": "Smith",
        ///         "email": "jane.smith@email.com",
        ///         "genderId": 2
        ///     }
        ///
        /// If a guest with this email already exists, returns the existing patient.
        /// </remarks>
        /// <response code="200">If email matches existing patient table entry with "guest" status, this entry will be fetched and used</response>
        /// <response code="201">Returns a newly addded "guest" patient</response>
        /// <response code="400">If response value is null</response>
        [HttpPost("guest")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Patient>> AddGuestPatient([FromBody] GuestRegDTO guestRegDTO)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var existingPatient = await _dataContext.Patients
                .FirstOrDefaultAsync(e => e.Email == guestRegDTO.Email);

            if (existingPatient == null)
            {
                var patient = new Patient
                {
                    Firstname = guestRegDTO.Firstname,
                    Lastname = guestRegDTO.Lastname,
                    Email = guestRegDTO.Email,
                    GenderId = guestRegDTO.GenderId,
                    Role = "Guest"
                };

                _dataContext.Patients.Add(patient);

                await _dataContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
            }
            
            return Ok(existingPatient);
        }

        /// <summary>
        /// Updates information for a patient.
        /// </summary>
        /// <remarks>
        ///     PUT /api/patient/5
        ///     {
        ///         "id": 5,
        ///         "email": "john.doe@newemail.com",
        ///         "firstname": "John",
        ///         "lastname": "Doe",
        ///         "genderId": 1,
        ///         "role": "User",
        ///         "birthdate": "1990-05-15",
        ///         "taxNumber": "12345",
        ///         "religion": "None"
        ///     }
        /// </remarks>
        /// <response code="204">No content returned on successful update</response>
        /// <response code="400">If response value is null</response>
        [HttpPut("{Id:int}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Patient>> UpdatePatient(int Id, Patient patient)
        {
            if (Id != patient.Id)
            {
                return BadRequest();
            }

            _dataContext.Update(patient);
            try
            {
                await _dataContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExistsById(Id))
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
        /// Removes a patient from the database.
        /// </summary>
        /// <response code="204">No content returned on successful deletion</response>
        /// <response code="400">If response value is null</response>
        [HttpDelete("{Id}")]
        [Authorize(Roles = "Admin")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Location>> DeletePatient(int Id)
        {
            if (_dataContext.Patients == null)
            {
                return NotFound();
            }

            var patient = await _dataContext.Patients
                .Include(a => a.Appointments)
                .FirstOrDefaultAsync(d => d.Id == Id);

            if (patient is null)
            {
                return NotFound();
            }

            if (patient.Appointments != null && patient.Appointments.Count > 0)
            {
                return BadRequest("Unable to delete entry because of appointments linked to it.");
            }

            _dataContext.Patients.Remove(patient);
            await _dataContext.SaveChangesAsync();
            return NoContent();
        }

        private bool PatientExistsById(int id)
        {
            return (_dataContext.Patients?.Any(patient => patient.Id == id)).GetValueOrDefault();
        }
    }
}
