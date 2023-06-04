namespace WebAppWithReact.Features.Auth;

public record RefreshTokenResponse
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime Expiration { get; set; }
}
