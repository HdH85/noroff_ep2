using System.ComponentModel.DataAnnotations;

public class PatientRegisterDTO
{
    [Required(ErrorMessage = "Must provide a first name.")]
    public  string Firstname { get; set; }
    [Required(ErrorMessage = "Must provide a last name.")]
    public  string Lastname { get; set; }
    [Required(ErrorMessage = "Must provide an email address.")]
    [EmailAddress(ErrorMessage = "Please provide a valid email address.")]
    public string Email { get; set; }
    public string Ssn { get; set; }
    public DateTime Birthdate { get; set; }
    public string TaxNumber { get; set; }
    public string Religion { get; set; }
    public string DriversLicenseNumber { get; set; }
    public string MedicalInsuranceNumber { get; set; }
    [Required(ErrorMessage = "Must select a gender.")]
    public int GenderId { get; set; }
    [Required(ErrorMessage = "Must choose a password.")]
    public  string Password { get; set; }
}