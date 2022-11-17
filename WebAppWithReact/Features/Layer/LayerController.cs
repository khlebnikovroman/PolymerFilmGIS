using DAL;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using WebAppWithReact.Controllers;


namespace WebAppWithReact.Features.Layer;

public class LayerController : BaseAuthorizedController
{
    private readonly Context _db;
    private readonly LayerService _layerService;

    public LayerController(Context context, LayerService layerService)
    {
        _db = context;
        _layerService = layerService;
        _layerService.User = User;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (IsUserAdmin)
        {
            var allLayers = await _db.Layers.ToListAsync();

            return Ok(allLayers);
        }

        var userLayers = await _db.Layers.Where(l => l.AppUserId == UserId).ToListAsync();

        return Ok(userLayers);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var l = await _db.Layers.FindAsync(id);

        if (l is not null)
        {
            if (l.AppUserId == UserId || IsUserAdmin)
            {
                return Ok(l);
            }

            return Forbid();
        }

        return NotFound();
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLayerDto dto)
    {
        var id = await _layerService.Create(dto);

        return Ok(id);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateLayerDto dto)
    {
        try
        {
            await _layerService.Update(dto);

            return Ok();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _layerService.Delete(id);

            return Ok();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
    }
}
