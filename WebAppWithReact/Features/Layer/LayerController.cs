using Mapster;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WebAppWithReact.Controllers;
using WebAppWithReact.Extensions;
using WebAppWithReact.Features.Layer.DTO;
using WebAppWithReact.Misc.AuthHandlers;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.Layer;

/// <summary>
///     Контроллер для работы со слоями
/// </summary>
public class LayerController : BaseAuthorizedController
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IGenericRepository<DAL.Layer> _layerRepository;
    private readonly LayerService _layerService;
    private readonly IGenericRepository<DAL.ObjectOnMap> _objectOnMapRepository;

    public LayerController(IGenericRepository<DAL.Layer> layerRepository, IGenericRepository<DAL.ObjectOnMap> objectOnMapRepository,
                           LayerService layerService, IAuthorizationService authorizationService)
    {
        _layerRepository = layerRepository;
        _objectOnMapRepository = objectOnMapRepository;
        _layerService = layerService;
        _authorizationService = authorizationService;
    }

    /// <summary>
    ///     Получает все слои
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyCollection<GetLayerDto>>> Get()
    {
        var layers = await _layerRepository.Get(x => x.AppUserId == User.GetLoggedInUserId<Guid>());
        var layersDto = layers.Adapt<List<GetLayerDto>>();

        return Ok(layersDto);
    }

    /// <summary>
    ///     Получает слой по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<GetLayerDto>> Get(Guid id)
    {
        var l = await _layerRepository.FindById(id);

        var authorizeResult = await _authorizationService.AuthorizeAsync(User, l, Policies.IsObjectOwnByUser);

        if (authorizeResult.Succeeded)
        {
            var o = await _layerService.Get(id);

            return Ok(o);
        }

        return Forbid();
    }

    /// <summary>
    ///     Создает слой
    /// </summary>
    /// <param name="dto">DTO с информацией о слое</param>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<Guid>> Create([FromBody] CreateLayerDto dto)
    {
        var authorizeResult = true;

        foreach (var oId in dto.Objects)
        {
            var obj = await _objectOnMapRepository.FindById(oId);
            authorizeResult = authorizeResult && _authorizationService.AuthorizeAsync(User, obj, Policies.IsObjectOwnByUser).Result.Succeeded;

            if (!authorizeResult)
            {
                break;
            }
        }

        var id = await _layerService.Create(dto, User.GetLoggedInUserId<Guid>());

        return Ok(id);
    }

    /// <summary>
    ///     Обновляет слой
    /// </summary>
    /// <param name="dto">DTO с информацией о слое</param>
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> Update([FromBody] UpdateLayerDto dto)
    {
        var layer = await _layerRepository.FindById((Guid) dto.Id);
        var layerAuthorizeResult = _authorizationService.AuthorizeAsync(User, layer, Policies.IsObjectOwnByUser).Result.Succeeded;
        var objectsAuthorizeResult = true;

        foreach (var oId in dto.Objects)
        {
            var obj = await _objectOnMapRepository.FindById(oId);

            objectsAuthorizeResult = objectsAuthorizeResult &&
                                     _authorizationService.AuthorizeAsync(User, obj, Policies.IsObjectOwnByUser).Result.Succeeded;

            if (!objectsAuthorizeResult)
            {
                break;
            }
        }

        if (objectsAuthorizeResult && layerAuthorizeResult)
        {
            await _layerService.Update(dto);

            return Ok();
        }

        return Forbid();
    }

    /// <summary>
    ///     Удаляет слой по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
    /// <returns></returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> Delete(Guid id)
    {
        var layer = await _layerRepository.FindById(id);
        var authorizeResult = await _authorizationService.AuthorizeAsync(User, layer, Policies.IsObjectOwnByUser);

        if (authorizeResult.Succeeded)
        {
            await _layerService.Delete(id);

            return Ok();
        }

        return Forbid();
    }

    /// <summary>
    ///     Удаляет объект со слоя
    /// </summary>
    /// <param name="dto">DTO с информацией об объекте</param>
    [HttpDelete("objects")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> DeleteObjectFromLayer([FromBody] DeleteObjectFromLayerDTO dto)
    {
        var layer = await _layerRepository.FindById(dto.LayerId);
        var objectOnMap = await _objectOnMapRepository.FindById(dto.ObjectId);
        var authorizeResult1 = await _authorizationService.AuthorizeAsync(User, layer, Policies.IsObjectOwnByUser);
        var authorizeResult2 = await _authorizationService.AuthorizeAsync(User, objectOnMap, Policies.IsObjectOwnByUser);

        if (authorizeResult1.Succeeded && authorizeResult2.Succeeded)
        {
            await _layerService.DeleteObjectFromLayer(dto);

            return Ok();
        }

        return Forbid();
    }

    /// <summary>
    ///     Добавляет объект на слой
    /// </summary>
    /// <param name="dto">DTO с информацией об объекте</param>
    [HttpPost("objects")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult> AddObjectToLayerDTO([FromBody] AddObjectToLayerDTO dto)
    {
        var layer = await _layerRepository.FindById(dto.LayerId);
        var objectOnMap = await _objectOnMapRepository.FindById(dto.ObjectId);
        var authorizeResult1 = await _authorizationService.AuthorizeAsync(User, layer, Policies.IsObjectOwnByUser);
        var authorizeResult2 = await _authorizationService.AuthorizeAsync(User, objectOnMap, Policies.IsObjectOwnByUser);

        if (authorizeResult1.Succeeded && authorizeResult2.Succeeded)
        {
            await _layerService.AddObjectToLayer(dto);

            return Ok();
        }

        return Forbid();
    }
}
