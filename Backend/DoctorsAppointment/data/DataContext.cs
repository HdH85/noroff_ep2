using Microsoft.EntityFrameworkCore;
using DoctorsAppointment.Models;

namespace DoctorsAppointment.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
            
        }

        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Location> Locations { get; set; }
        public DbSet<Specialty> Specialties { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<WorkHours> WorkHours { get; set; }
        public DbSet<Gender> Genders { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Specialty>()
                .HasMany(d => d.Doctors)
                .WithOne(s => s.Specialty)
                .HasForeignKey(k => k.SpecialtyId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Location>()
                .HasMany(d => d.Doctors)
                .WithOne(s => s.Location)
                .HasForeignKey(k => k.LocationId)
                .OnDelete(DeleteBehavior.SetNull);
            
            modelBuilder.Entity<Doctor>()
                .HasMany(a => a.Appointments)
                .WithOne(d => d.Doctor)
                .HasForeignKey(k => k.DoctorId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Patient>()
                .HasMany(a => a.Appointments)
                .WithOne(p => p.Patient)
                .HasForeignKey(k => k.PatientId)
                .OnDelete(DeleteBehavior.SetNull);
            
            modelBuilder.Entity<WorkHours>()
                .HasOne(d => d.Doctor)
                .WithMany(w => w.WorkHours)
                .HasForeignKey(i => i.DoctorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WorkHours>()
                .HasOne(l => l.Location)
                .WithMany(w => w.WorkHours)
                .HasForeignKey(i => i.LocationId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<WorkHours>()
                .HasIndex(a => new { a.DoctorId, a.LocationId, a.DayOfWeek })
                .IsUnique();
            
            modelBuilder.Entity<Appointment>()
                .HasIndex(a => new { a.DoctorId, a.Start })
                .IsUnique();

            modelBuilder.Entity<Gender>()
                .HasMany(p => p.Patients)
                .WithOne(g => g.Gender)
                .HasForeignKey(i => i.GenderId);
        }
    }
}