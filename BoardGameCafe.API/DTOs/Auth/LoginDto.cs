using System.ComponentModel.DataAnnotations;

namespace BoardGameCafe.API.DTOs.Auth;

public class LoginDto
{
    [Required, MaxLength(100)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
