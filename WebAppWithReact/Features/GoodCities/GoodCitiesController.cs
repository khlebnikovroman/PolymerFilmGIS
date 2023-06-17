using Microsoft.AspNetCore.Mvc;

using WebAppWithReact.Controllers;


namespace WebAppWithReact.Features.GoodCities;

public class GoodCitiesController : BaseAuthorizedController
{
    private readonly IGoodCitiesService _goodCitiesService;

    public GoodCitiesController(IGoodCitiesService goodCitiesService)
    {
        _goodCitiesService = goodCitiesService;
    }

    [HttpGet]
    [Route("GetCities")]
    public async Task<ActionResult<IReadOnlyCollection<CityDto>>> Get()
    {
        var goodCities = await _goodCitiesService.GetGoodCities(UserId);

        return Ok(goodCities);
    }
}
