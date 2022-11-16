namespace WebAppWithReact.Features.ObjectOnMap.DTO;

public record ObjectOnMapDetailsDto : ObjectOnMapDto
{
    public Guid Id { get; set; }
    public Guid AppUserId { get; set; }
}
