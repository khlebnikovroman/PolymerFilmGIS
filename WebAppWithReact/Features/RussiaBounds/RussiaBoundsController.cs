using System.Text.Json;

using Microsoft.AspNetCore.Mvc;


namespace WebAppWithReact.Features.RussiaBounds;

[ApiController]
[Route("api/[controller]")]
public class RussiaBoundsController : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<JsonDocument>> Get()
    {
        var geoData = System.IO.File.ReadAllText("russiaBounds.geojson");

        return Ok(geoData);
    }
}
