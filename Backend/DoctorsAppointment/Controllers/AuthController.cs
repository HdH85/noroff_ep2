using Microsoft.AspNetCore.Mvc;

namespace DoctorsAppointment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authservice;

        public AuthController(AuthService authservice)
        {
            _authservice = authservice;
        }

        /// <summary>
        /// Enter username and password to log in.
        /// </summary>
        /// <remarks>
        ///     {
        ///         "username": "jdoe",
        ///         "password": "P@ssw0rd123"
        ///     }
        /// </remarks>
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginDTO request)
        {
            if (await _authservice.ValidateUserAsync(request.Username, request.Password))
            {
                var user = await _authservice.GetUserByUsernameAsync(request.Username);
                var token = _authservice.GenerateToken(user);
                return Ok(new {Token = token});
            }

            return Unauthorized("Invalid username or password");
        }

        /// <summary>
        /// Enter username and password to create a new account.
        /// </summary>
        /// <remarks>
        ///     {
        ///         "username": "jdoe",
        ///         "password": "P@ssw0rd123"
        ///     }
        /// </remarks>
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterDTO request)
        {
            if (await _authservice.RegisterUserAsync(request.Username, request.Password))
            {
                return Ok("Registration successful");
            }
            return BadRequest("Username already exists");
        }
    }
}