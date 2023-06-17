namespace WebAppWithReact.Features.GoodCities;

public interface IGoodCitiesService

{
    public Task<List<CityDto>> GetGoodCities(Guid userId);
}
