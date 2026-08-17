using DoctorsAppointment.Models;
using DoctorsAppointment.Data;
using Microsoft.EntityFrameworkCore;

public class AppointmentService
{
    private readonly DataContext _dataContext;

    public AppointmentService(DataContext dataContext)
    {
        _dataContext = dataContext;
    }
    public async Task<IEnumerable<TimeOnly>> FetchAvailableSlotsAsync(int doctorId, DateOnly date)
    {
        var workHours = await _dataContext.WorkHours
            .FirstOrDefaultAsync(i => i.DoctorId == doctorId && i.DayOfWeek == date.DayOfWeek);

        if (workHours == null || workHours.AppointmentTime <= 0)
            return Enumerable.Empty<TimeOnly>();

        var takenAppointments = await _dataContext.Appointments.
        Where(a => a.DoctorId == doctorId && DateOnly
            .FromDateTime(a.Start) == date)
            .ToListAsync();
        
        var slots = new List<TimeOnly>();
        var currentTimeSpan = workHours.StartTime;

        while(currentTimeSpan.Add(TimeSpan.FromMinutes(workHours.AppointmentTime)) <= workHours.EndTime)
        {
            var start = TimeOnly.FromTimeSpan(currentTimeSpan);
            var end = TimeOnly.FromTimeSpan(currentTimeSpan
                .Add(TimeSpan.FromMinutes(workHours.AppointmentTime)));

            bool isTaken = takenAppointments.Any(a =>
                TimeOnly.FromDateTime(a.Start) < end &&
                TimeOnly.FromDateTime(a.End) > start);
            
            if (!isTaken)
                slots.Add(start);
            
            currentTimeSpan = currentTimeSpan.Add(TimeSpan.FromMinutes(workHours.AppointmentTime));
        }

        return slots;
    }

    public async Task<Appointment> BookAppointmentAsync(BookingDTO bookingDTO)
    {
        var workHours = await _dataContext.WorkHours
            .FirstOrDefaultAsync(i => i.DoctorId == bookingDTO.DoctorId);

        if (workHours == null)
            throw new InvalidOperationException("No work hours found for selected doctor.");

        if (bookingDTO.Start < DateTime.UtcNow.AddHours(1))
            throw new ArgumentException("Can't book appointments less than an hour in advance.");
        
        if (bookingDTO.Start > DateTime.UtcNow.AddMonths(6))
            throw new ArgumentException("Can't book appointments more than 6 months in advance.");
        
        var appointment = new Appointment
            {
                PatientId = bookingDTO.PatientId,
                Start = bookingDTO.Start,
                End = bookingDTO.Start.AddMinutes(workHours.AppointmentTime),
                LocationId = bookingDTO.LocationId,
                DoctorId = bookingDTO.DoctorId,
                Description = bookingDTO.Description
            };
        
        if (await AppointmentIsTakenAsync(appointment))
            throw new InvalidOperationException("Appointment slot already taken.");

        _dataContext.Appointments.Add(appointment);
        await _dataContext.SaveChangesAsync();

        return appointment;
    }

    public async Task<bool> AppointmentExistsAsync(int id)
        {
            return (_dataContext.Appointments?.Any(appointment => appointment.Id == id)).GetValueOrDefault();
        }

    public async Task<bool> AppointmentIsTakenAsync(Appointment newAppointment)
        {
            return (_dataContext.Appointments?.Any(a => 
                a.DoctorId == newAppointment.DoctorId &&
                a.Id != newAppointment.Id &&
                    (
                        (newAppointment.Start >= a.Start && newAppointment.Start < a.End) ||
                        (newAppointment.End > a.Start && newAppointment.End <= a.End) ||
                        (newAppointment.Start <= a.Start && newAppointment.End >= a.End)
                    ) ||
                a.PatientId == newAppointment.PatientId &&
                a.Id != newAppointment.Id &&
                    (
                        (newAppointment.Start >= a.Start && newAppointment.Start < a.End) ||
                        (newAppointment.End > a.Start && newAppointment.End <= a.End) ||
                        (newAppointment.Start <= a.Start && newAppointment.End >= a.End)
                    )
                )
            ).GetValueOrDefault();
        }
}