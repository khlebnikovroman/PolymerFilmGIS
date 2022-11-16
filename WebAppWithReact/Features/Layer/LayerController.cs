using DAL;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using WebAppWithReact.Controllers;


namespace WebAppWithReact.Features.Layer;

public class LayerController : BaseAuthorizedController
{
    private readonly Context _db;

    public LayerController(Context context)
    {
        _db = context;
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
}
