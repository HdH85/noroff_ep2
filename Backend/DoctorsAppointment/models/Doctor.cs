namespace DoctorsAppointment.Models
{
    public class Doctor
    {
        public int Id { get; set;}
        public string Firstname { get; set;}
        public string Lastname { get; set;}
        public string ImageUrl { get; set; }
        
        public int? SpecialtyId { get; set;}
        public Specialty? Specialty { get; set;}
        public int? LocationId { get; set;}
        public Location? Location { get; set;}
        
        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<WorkHours>? WorkHours { get; set; } = new List<WorkHours>();
    }
}