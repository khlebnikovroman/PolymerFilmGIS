namespace WebAppWithReact.Features.GoodCities;

public class CityDto
{
    public string Name { get; set; }
    public double Lat { get; set; }
    public double Lng { get; set; }
    public int Population { get; set; }
    public bool IsRailwayNearby { get; set; }
}
