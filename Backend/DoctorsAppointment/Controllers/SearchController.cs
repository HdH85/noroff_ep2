using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DoctorsAppointment.Data;

namespace DoctorsAppointment.Controllers
{
    [ApiController]
    [Produces("application/json")]
    public class SearchController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public SearchController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        /// <summary>
        /// Searches the doctor database.
        /// </summary>
        /// <response code="200">Returns a list of matching results</response>
        /// <response code="404">If response value is null</response>
        [HttpGet("search")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<DoctorSearchDTO>>> DoctorSearch(string query)
        {
            if(string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search field cannot be empty");
            }
            
            var results = await _dataContext.Doctors
            .Include(s => s.Specialty)
            .Include(l => l.Location)
            .Where(d => d.Firstname.ToLower().Contains(query.ToLower()) || 
                    d.Lastname.ToLower().Contains(query.ToLower()) ||
                    (d.Location != null && d.Location.Name.ToLower().Contains(query.ToLower())) ||
                    (d.Specialty != null && d.Specialty.Name.ToLower().Contains(query.ToLower()))
            )
            .Select(d => new DoctorSearchDTO
            {
                FullName = d.Firstname + " " + d.Lastname,
                ImageUrl = d.ImageUrl,
                LocationName = d.Location != null ? d.Location.Name : "Unknown",
                Specialty = d.Specialty != null ? d.Specialty.Name : "Unknown"
            }).ToListAsync();

            return results;
        }
    }
}
