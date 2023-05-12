namespace WebAppWithReact.Features.ObjectOnMap.DTO;

/// <summary>
///     DTO с информацией об объекте
/// </summary>
public record GetObjectOnMapDto
{
    public Guid Id { get; set; }
    public Guid AppUserId { get; set; }
    public string Name { get; set; }
    public double Lati { get; set; }
    public double Long { get; set; }
    public double Capacity { get; set; }
}




