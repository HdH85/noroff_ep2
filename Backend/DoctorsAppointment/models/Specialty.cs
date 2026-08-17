namespace DoctorsAppointment.Models
{
    public class Specialty
    {
        public int Id { get; set;}
        public string Name { get; set;}

        public ICollection<Doctor>? Doctors { get; set; }
    }
}