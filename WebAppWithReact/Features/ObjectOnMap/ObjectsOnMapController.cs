using DAL;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using WebAppWithReact.Controllers;
using WebAppWithReact.Features.ObjectOnMap.DTO;


namespace WebAppWithReact.Features.ObjectOnMap;

public class ObjectsOnMapController : BaseAuthorizedController
{
    private readonly Context _db;
    private readonly ObjectOnMapService _objectOnMapService;

    public ObjectsOnMapController(Context context, ObjectOnMapService objectOnMapService)
    {
        _db = context;
        _objectOnMapService = objectOnMapService;
    }


    // todo переписать (сейчас это заглушка(нельзя использовать для админа))
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyCollection<ObjectOnMapDto>))]
    public async Task<IActionResult> Get()
    {
        await _db.ObjectsOnMap.LoadAsync();

        var l = await _db.ObjectsOnMap
                         .Where(o => o.AppUserId == UserId)
                         .ToListAsync();

        return Ok(l);
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ObjectOnMapDetailsDto))]
    public async Task<IActionResult> Get(Guid id)
    {
        try
        {
            var o = await _objectOnMapService.Get(id);

            return Ok(o);
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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateObjectOnMapDto dto)
    {
        var id = await _objectOnMapService.Create(dto);

        return Ok(id);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromBody] UpdateObjectOnMapDto dto)
    {
        try
        {
            await _objectOnMapService.Update(dto);

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

    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ObjectOnMapDetailsDto))]
    public async Task<IActionResult> Delete([FromBody] Guid id)
    {
        try
        {
            await _objectOnMapService.Delete(id);

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
