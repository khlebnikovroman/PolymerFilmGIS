namespace WebAppWithReact.Features.Auth;

/// <summary>
///     DTO для токена
/// </summary>
public class RefreshTokenModel
{
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
}
