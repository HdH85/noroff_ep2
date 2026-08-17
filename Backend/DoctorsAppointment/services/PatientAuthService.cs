using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DoctorsAppointment.Data;
using DoctorsAppointment.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class PatientAuthService
{
    private readonly DataContext _dataContext;
    private readonly JwtSettings _jwtSettings;

    public PatientAuthService(DataContext dataContext, JwtSettings jwtSettings)
    {
        _dataContext = dataContext;
        _jwtSettings = jwtSettings;
    }

    public async Task<bool> ValidatePatientAsync(string email, string password)
    {
        var patient = await _dataContext.Patients.SingleOrDefaultAsync(e => e.Email == email);
        if (patient == null)
            return false;
        
        var passwordHasher = new PasswordHasher<Patient>();
        var result = passwordHasher.VerifyHashedPassword(patient, patient.PasswordHash, password);

        return result == PasswordVerificationResult.Success;
    }

    public async Task<bool> RegisterPatientAsync(string email, string firstname, string lastname, string ssn, DateTime birthdate, string taxnumber, string religion, string driversLicenseNumber, string medicalInsuranceNumber, int genderId, string password)
    {
        if (await _dataContext.Patients.AnyAsync(e => e.Email == email))
            return false;

        var patient = new Patient
        {
            Email = email,
            Firstname = firstname,
            Lastname = lastname,
            Ssn = ssn,
            Birthdate = birthdate,
            TaxNumber = taxnumber,
            Religion = religion,
            DriversLicenseNumber = driversLicenseNumber,
            MedicalInsuranceNumber = medicalInsuranceNumber,
            GenderId = genderId,
            Role = "User"
        };
        var passwordHasher = new PasswordHasher<Patient>();
        patient.PasswordHash = passwordHasher.HashPassword(patient, password);

        _dataContext.Patients.Add(patient);
        await _dataContext.SaveChangesAsync();
        return true;
    }

    public async Task<Patient?> GetPatientByEmailAsync(string email)
    {
        return await _dataContext.Patients.SingleOrDefaultAsync(u => u.Email == email);
    }

    public string GenerateToken(Patient patient)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Role, patient.Role),
            new Claim("patientId", patient.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, patient.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(_jwtSettings.ExpiryMinutes),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
        
    }
}