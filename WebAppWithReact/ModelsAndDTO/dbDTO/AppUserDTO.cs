namespace WebAppWithReact.ModelsAndDTO.dbDTO;

public record AppUserDTO
{
    public string FirstName { get; set; }
    public string SecondName { get; set; }
    public IEnumerable<LayerDTO> Layers { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime RefreshTokenExpiryTime { get; set; }
}
