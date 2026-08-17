using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using DoctorsAppointment.Data;
using DoctorsAppointment.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public class AuthService
{
    private readonly DataContext _dataContext;
    private readonly JwtSettings _jwtSettings;

    public AuthService(DataContext dataContext, JwtSettings jwtSettings)
    {
        _dataContext = dataContext;
        _jwtSettings = jwtSettings;
    }

    public async Task<bool> ValidateUserAsync(string username, string password)
    {
        var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.Username == username);
        if (user == null)
            return false;
        
        var passwordHasher = new PasswordHasher<User>();
        var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

        return result == PasswordVerificationResult.Success;
    }

    public async Task<bool> RegisterUserAsync(string username, string password)
    {
        if (await _dataContext.Users.AnyAsync(u => u.Username == username))
            return false;

        var user = new User
        {
            Username = username,
            Role = "Admin"
        };
        var passwordHasher = new PasswordHasher<User>();
        user.PasswordHash = passwordHasher.HashPassword(user, password);

        _dataContext.Users.Add(user);
        await _dataContext.SaveChangesAsync();
        return true;
    }

    public async Task<User> GetUserByUsernameAsync(string username)
    {
        return await _dataContext.Users.SingleOrDefaultAsync(u => u.Username == username);
    }

    public string GenerateToken(User user)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames.Sub, user.Username),
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