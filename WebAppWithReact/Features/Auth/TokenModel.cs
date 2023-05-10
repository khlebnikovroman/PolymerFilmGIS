namespace WebAppWithReact.Features.Auth;

/// <summary>
///     DTO для токена
/// </summary>
public class TokenModel
{
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
}



