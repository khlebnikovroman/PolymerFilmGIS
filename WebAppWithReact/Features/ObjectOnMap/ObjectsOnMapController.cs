using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WebAppWithReact.Controllers;
using WebAppWithReact.Features.ObjectOnMap.DTO;
using WebAppWithReact.Misc.AuthHandlers;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.ObjectOnMap;

public class ObjectsOnMapController : BaseAuthorizedController
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IGenericRepository<DAL.ObjectOnMap> _objectOnMapRepository;
    private readonly ObjectOnMapService _objectOnMapService;

    public ObjectsOnMapController(IGenericRepository<DAL.ObjectOnMap> objectOnMapRepository, ObjectOnMapService objectOnMapService,
                                  IAuthorizationService authorizationService)
    {
        _objectOnMapRepository = objectOnMapRepository;
        _objectOnMapService = objectOnMapService;
        _authorizationService = authorizationService;
    }


    // todo переписать (сейчас это заглушка(нельзя использовать для админа))
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyCollection<ObjectOnMapDto>))]
    public async Task<IActionResult> Get()
    {
        // await _db.ObjectsOnMap.LoadAsync();
        //
        // var l = await _db.ObjectsOnMap
        //                  .Where(o => o.AppUserId == UserId)
        //                  .ToListAsync();

        //return Ok(l);
        return Ok();
    }

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ObjectOnMapDetailsDto))]
    public async Task<IActionResult> Get(Guid id)
    {
        //получается делается два запроса к бд, возможно это можно как-то оптимизировать но сейчас (07.12.2022) уже нет на это времени
        var obj = await _objectOnMapRepository.FindById(id);
        var authorizeResult = await _authorizationService.AuthorizeAsync(User, obj, Policies.IsObjectOwnByUser);

        if (authorizeResult.Succeeded)
        {
            var o = await _objectOnMapService.Get(id);

            return Ok(o);
        }

        return Forbid();
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Guid))]
    public async Task<IActionResult> Create([FromBody] CreateObjectOnMapDto dto)
    {
        var id = await _objectOnMapService.Create(dto, UserId);

        return Ok(id);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromBody] UpdateObjectOnMapDto dto)
    {
        var obj = await _objectOnMapRepository.FindById((Guid) dto.Id);
        var authorizeResult = await _authorizationService.AuthorizeAsync(User, obj, Policies.IsObjectOwnByUser);

        if (authorizeResult.Succeeded)
        {
            await _objectOnMapService.Update(dto);

            return Ok();
        }

        return Forbid();
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var obj = await _objectOnMapRepository.FindById(id);
        var authorizeResult = await _authorizationService.AuthorizeAsync(User, obj, Policies.IsObjectOwnByUser);

        if (authorizeResult.Succeeded)
        {
            await _objectOnMapService.Delete(id);

            return Ok();
        }

        return Forbid();
    }
}
