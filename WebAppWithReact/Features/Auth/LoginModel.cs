using System.ComponentModel.DataAnnotations;


namespace WebAppWithReact.Features.Auth;

/// <summary>
///     DTO для аутентификации
/// </summary>
public class LoginModel
{
    [Required(ErrorMessage = "User Name is required")]
    public string? Username { get; set; }

    [Required(ErrorMessage = "Password is required")]
    public string? Password { get; set; }
}

