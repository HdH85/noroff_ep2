using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Ocsp;

namespace DoctorsAppointment.Controllers
{
    [ApiController]
    [Route("api/patient/[controller]")]
    public class PatientAuthController : ControllerBase
    {
        private readonly PatientAuthService _patientAuthService;

        public PatientAuthController(PatientAuthService patientAuthService)
        {
            _patientAuthService = patientAuthService;
        }

        /// <summary>
        /// Enter username and password to log in.
        /// </summary>
        /// <remarks>
        ///     POST /api/patient/auth/login
        ///     {
        ///         "email": "john.doe@email.com",
        ///         "password": "P@ssw0rd123"
        ///     }
        /// </remarks>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] PatientLoginDTO request)
        {
            if (await _patientAuthService.ValidatePatientAsync(request.Email, request.Password))
            {
                var user = await _patientAuthService.GetPatientByEmailAsync(request.Email);
                var token = _patientAuthService.GenerateToken(user);
                return Ok(new {Token = token});
            }

            return Unauthorized("Invalid email or password");
        }

        /// <summary>
        /// Enter username and password to create a new account.
        /// </summary>
        /// <remarks>
        ///     POST /api/patient/auth/register
        ///     {
        ///         "firstname": "John",
        ///         "lastname": "Doe",
        ///         "email": "john.doe@email.com",
        ///         "password": "P@ssw0rd123"
        ///     }
        /// </remarks>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] PatientRegisterDTO request)
        {
            if (await _patientAuthService.RegisterPatientAsync(
                request.Email, 
                request.Firstname, 
                request.Lastname,
                request.Ssn,
                request.Birthdate,
                request.TaxNumber,
                request.Religion,
                request.DriversLicenseNumber,
                request.MedicalInsuranceNumber,
                request.GenderId,
                request.Password
                ))
            {
                return Ok("Registration successful");
            }
            return BadRequest("Username already exists");
        }
    }
}