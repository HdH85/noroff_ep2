namespace DoctorsAppointment.Models
{
    public class Appointment
    {
        public int Id { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int? PatientId { get; set; }
        public Patient? Patient { get; set; } 
        public int? DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
        public int? LocationId { get; set; }
        public Location? Location { get; set; }

    }
}