namespace WebAppWithReact.Features.GoodCities;

public interface IGoodCitiesService
{
    public List<CityDto> GetGoodCities(Guid userId);
}
