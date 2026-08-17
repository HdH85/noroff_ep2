namespace DoctorsAppointment.Models
{
    public class Location
    {
        public int Id { get; set;}
        public string Name { get; set;}
        public string Address { get; set; }
        public string ImageUrl { get; set; }

        public ICollection<Doctor>? Doctors { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<WorkHours>? WorkHours { get; set; } = new List<WorkHours>();
    }
}