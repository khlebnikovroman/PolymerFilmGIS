using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WebAppWithReact.Controllers;
using WebAppWithReact.Features.ObjectOnMap.DTO;
using WebAppWithReact.Misc.AuthHandlers;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.ObjectOnMap;

/// <summary>
///     Контроллер объектов
/// </summary>
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


    /// <summary>
    ///     Получает все объекты, которые не принадлежат ни одному слою
    /// </summary>
    [HttpGet]
    [Route("GetAllWithoutLayer")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyCollection<ObjectOnMapDetailsDto>))]
    public async Task<IActionResult> GetWithoutLayer()
    {
        var objects = await _objectOnMapRepository.Get(o => o.AppUserId == UserId && o.LayerId == null);
        var objectDtos = new List<ObjectOnMapDetailsDto>();

        foreach (var objectOnMap in objects)
        {
            var o = new ObjectOnMapDetailsDto
            {
                AppUserId = objectOnMap.AppUserId,
                Capacity = objectOnMap.Capacity,
                Id = objectOnMap.Id,
                Lati = objectOnMap.Lati,
                Long = objectOnMap.Long,
                Name = objectOnMap.Name,
            };

            objectDtos.Add(o);
        }

        return Ok(objectDtos);
    }

    /// <summary>
    ///     Получает все объекты
    /// </summary>

    // todo переписать (сейчас это заглушка(нельзя использовать для админа))
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyCollection<ObjectOnMapDetailsDto>))]
    public async Task<IActionResult> Get()
    {
        var objects = await _objectOnMapRepository.Get(o => o.AppUserId == UserId);
        var objectDtos = new List<ObjectOnMapDetailsDto>();

        foreach (var objectOnMap in objects)
        {
            var o = new ObjectOnMapDetailsDto
            {
                AppUserId = objectOnMap.AppUserId,
                Capacity = objectOnMap.Capacity,
                Id = objectOnMap.Id,
                Lati = objectOnMap.Lati,
                Long = objectOnMap.Long,
                Name = objectOnMap.Name,
            };

            objectDtos.Add(o);
        }

        return Ok(objectDtos);
    }

    /// <summary>
    ///     Получает объект по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
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

    /// <summary>
    ///     Создет объект
    /// </summary>
    /// <param name="dto">DTO с информацией об объекте</param>
    /// <returns></returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Guid))]
    public async Task<IActionResult> Create([FromBody] CreateObjectOnMapDto dto)
    {
        var id = await _objectOnMapService.Create(dto, UserId);

        return Ok(id);
    }

    /// <summary>
    ///     Обновляет объект
    /// </summary>
    /// <param name="dto"> DTO с обновленной информацией об объекте</param>
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

    /// <summary>
    ///     Удаляет объект по ID
    /// </summary>
    /// <param name="id">ID объекта</param>
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

