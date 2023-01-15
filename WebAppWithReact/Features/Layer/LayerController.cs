using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WebAppWithReact.Controllers;
using WebAppWithReact.Extensions;
using WebAppWithReact.Features.Layer.DTO;
using WebAppWithReact.Features.ObjectOnMap.DTO;
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
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyCollection<GetLayerDto>))]

    //todo переписать в сервис
    public async Task<IActionResult> GetAll()
    {
        var layers = await _layerRepository.Get(x => x.AppUserId == User.GetLoggedInUserId<Guid>());
        var layersDto = new List<GetLayerDto>();

        foreach (var layer in layers)
        {
            var objects = new List<ObjectOnMapDto>();

            if (layer.ObjectsOnMap != null)
            {
                foreach (var objectOnMap in layer.ObjectsOnMap)
                {
                    var oDto = new ObjectOnMapDto
                    {
                        Capacity = objectOnMap.Capacity,
                        Lati = objectOnMap.Lati,
                        Long = objectOnMap.Long,
                        Name = objectOnMap.Name,
                    };

                    objects.Add(oDto);
                }
            }

            var layerDto = new GetLayerDto
            {
                Id = layer.Id,
                Name = layer.Name,
                Objects = objects,
            };

            layersDto.Add(layerDto);
        }

        return Ok(layersDto);
    }

    /// <summary>
    ///     Получает слой по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetLayerDto))]
    public async Task<IActionResult> Get(Guid id)
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
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Guid))]
    public async Task<IActionResult> Create([FromBody] CreateLayerDto dto)
    {
        var id = await _layerService.Create(dto, User.GetLoggedInUserId<Guid>());

        return Ok(id);
    }

    /// <summary>
    ///     Обновляет слой
    /// </summary>
    /// <param name="dto">DTO с информацией о слое</param>
    [HttpPut]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Update([FromBody] UpdateLayerDto dto)
    {
        var layer = await _layerRepository.FindById((Guid) dto.Id);
        var authorizeResult = await _authorizationService.AuthorizeAsync(User, layer, Policies.IsObjectOwnByUser);

        if (authorizeResult.Succeeded)
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
    public async Task<IActionResult> Delete(Guid id)
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
    public async Task<IActionResult> DeleteObjectFromLayer([FromBody] DeleteObjectFromLayerDTO dto)
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
    public async Task<IActionResult> AddObjectToLayerDTO([FromBody] AddObjectToLayerDTO dto)
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

