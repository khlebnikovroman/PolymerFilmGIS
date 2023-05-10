namespace WebAppWithReact.Features.ObjectOnMap.DTO;

/// <summary>
///     DTO с детальными данными об объекте
/// </summary>
public record ObjectOnMapDetailsDto : ObjectOnMapDto
{
    public Guid Id { get; set; }
    public Guid AppUserId { get; set; }
}



