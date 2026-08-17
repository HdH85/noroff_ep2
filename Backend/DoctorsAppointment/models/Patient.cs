namespace DoctorsAppointment.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public  string Email { get; set; }
        public string? PasswordHash { get; set; }
        public  string Firstname { get; set; }
        public  string Lastname { get; set; }
        public DateTime Birthdate { get; set; }
        public string? Ssn { get; set; } 
        public string? TaxNumber { get; set; }
        public string? Religion { get; set; }
        public string? DriversLicenseNumber { get; set; }
        public string? MedicalInsuranceNumber { get; set; }
        public string Role { get; set; } = "Guest";

         public int GenderId { get; set; }
         public Gender? Gender { get; set; }

        public ICollection<Appointment>? Appointments { get; set; }
        
    }
}