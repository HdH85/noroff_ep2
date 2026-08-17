public class BookingDTO
{
    public required int PatientId { get; set; }
    public required int LocationId { get; set; }
    public required int DoctorId { get; set; }
    public required DateTime Start { get; set; }
    public string Description { get; set; }
}