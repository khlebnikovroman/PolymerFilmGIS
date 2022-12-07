using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WebAppWithReact.Controllers;
using WebAppWithReact.Extensions;
using WebAppWithReact.Features.Layer.DTO;
using WebAppWithReact.Misc.AuthHandlers;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.Layer;

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

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        // if (IsUserAdmin)
        // {
        //     var allLayers = await _db.Layers.ToListAsync();
        //
        //     return Ok(allLayers);
        // }
        //
        // var userLayers = await _db.Layers.Where(l => l.AppUserId == UserId).ToListAsync();
        //
        // return Ok(userLayers);
        return Ok();
    }

    [HttpGet("{id}")]
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

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateLayerDto dto)
    {
        var id = await _layerService.Create(dto, User.GetLoggedInUserId<Guid>());

        return Ok(id);
    }

    [HttpPut]
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

    [HttpDelete("{id}")]
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

    [HttpPost("objects")]
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

    [HttpDelete("objects")]
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
