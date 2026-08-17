using System.ComponentModel.DataAnnotations;

public class GuestRegDTO
{
    [Required(ErrorMessage = "Must provide a first name.")]
    public required string Firstname { get; set; }
    [Required(ErrorMessage = "Must provide a last name.")]
    public required string Lastname { get; set; }
    [Required(ErrorMessage = "Must provide an email address.")]
    [EmailAddress(ErrorMessage = "Please provide a valid email address.")]
    public string Email { get; set; }
    [Required(ErrorMessage = "Must choose a gender option.")]
    public required int GenderId { get; set; }
}