namespace WebAppWithReact.Features.GoodCities;

public class GoodCitiesServiceStub : IGoodCitiesService
{
    public async Task<List<CityDto>> GetGoodCities(Guid userId)
    {
        return new List<CityDto>
        {
            new() {IsRailwayNearby = true, Lat = 60, Lng = 30, Population = 5000000, Name = "Питер",},
            new() {IsRailwayNearby = true, Lat = 55, Lng = 37, Population = 15000000, Name = "Москва",},
        };
    }
}
