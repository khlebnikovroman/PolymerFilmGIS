namespace WebAppWithReact.Features.Auth;

/// <summary>
///     DTO для ответа на запрос аутентификации
/// </summary>
public record LoginResponse
{
    public string Token { get; set; }
    public string RefreshToken { get; set; }
    public DateTime Expiration { get; set; }
}

