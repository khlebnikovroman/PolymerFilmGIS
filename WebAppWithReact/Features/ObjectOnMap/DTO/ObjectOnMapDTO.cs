namespace WebAppWithReact.Features.ObjectOnMap.DTO;

public record ObjectOnMapDto
{
    public string Name { get; set; }
    public double Lati { get; set; }
    public double Long { get; set; }
    public double Capacity { get; set; }
}
