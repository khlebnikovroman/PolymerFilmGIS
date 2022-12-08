namespace WebAppWithReact.Features.Auth;

public record LoginResponse
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime Expiration { get; set; }
}
