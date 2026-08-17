namespace DoctorsAppointment.Models
{
    public class WorkHours
    {
        public int Id { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public int AppointmentTime { get; set; }


        public int DoctorId { get; set; }
        public Doctor? Doctor { get; set; }
        public int LocationId { get; set; }
        public Location? Location { get; set; }
    }
}