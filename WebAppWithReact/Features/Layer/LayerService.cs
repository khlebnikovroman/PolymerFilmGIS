using Microsoft.AspNetCore.Authorization;

using WebAppWithReact.Features.Layer.DTO;
using WebAppWithReact.Features.ObjectOnMap.DTO;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.Layer;

public class LayerService
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IGenericRepository<DAL.Layer> _layerRepository;
    private readonly IGenericRepository<DAL.ObjectOnMap> _objectOnMapRepository;

    public LayerService(IGenericRepository<DAL.Layer> layerRepository, IGenericRepository<DAL.ObjectOnMap> objectOnMapRepository,
                        IAuthorizationService authorizationService)
    {
        _layerRepository = layerRepository;
        _objectOnMapRepository = objectOnMapRepository;
        _authorizationService = authorizationService;
    }


    public async Task<GetLayerDto> Get(Guid id)
    {
        var l = await _layerRepository.FindById(id);

        var objects = new List<ObjectOnMapDto>();

        foreach (var objectOnMap in l.ObjectsOnMap)
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

        var lDto = new GetLayerDto
        {
            Id = l.Id,
            Name = l.Name,
            Objects = objects,
        };

        return lDto;
    }

    public async Task<Guid> Create(CreateLayerDto dto, Guid userId)
    {
        var layer = new DAL.Layer
        {
            AppUserId = userId,
            Name = dto.Name!,
            ObjectsOnMap = new List<DAL.ObjectOnMap>(),
        };

        await _layerRepository.Create(layer);

        return layer.Id;
    }

    public async Task Update(UpdateLayerDto dto)
    {
        var layer = await _layerRepository.FindById((Guid) dto.Id);
        layer.Name = dto.Name;
        await _layerRepository.Update(layer);
    }

    public async Task Delete(Guid id)
    {
        var l = await _layerRepository.FindById(id);
        await _layerRepository.Remove(l);
    }

    public async Task AddObjectToLayer(AddObjectToLayerDTO dto)
    {
        var objectToAdd = await _objectOnMapRepository.FindById(dto.ObjectId);
        var layerToAdd = await _layerRepository.FindById(dto.LayerId);

        if (layerToAdd != null && objectToAdd != null)
        {
            if (layerToAdd.ObjectsOnMap == null)
            {
                layerToAdd.ObjectsOnMap = new List<DAL.ObjectOnMap>();
            }

            layerToAdd.ObjectsOnMap.Add(objectToAdd);
            await _layerRepository.Update(layerToAdd);
        }
    }

    public async Task DeleteObjectFromLayer(DeleteObjectFromLayerDTO dto)
    {
        var objectToDelete = await _objectOnMapRepository.FindById(dto.ObjectId);
        var layerToDelete = await _layerRepository.FindById(dto.LayerId);

        if (layerToDelete != null && objectToDelete != null)
        {
            layerToDelete.ObjectsOnMap.Remove(objectToDelete);
            await _layerRepository.Update(layerToDelete);
        }
    }
}
