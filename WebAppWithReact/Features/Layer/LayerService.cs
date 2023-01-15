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


    /// <summary>
    ///     Получает слой по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
    /// <returns>Информация о найденном слое</returns>
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

    /// <summary>
    ///     Создает слой
    /// </summary>
    /// <param name="dto">DTO с информацией о создаваемом объекте</param>
    /// <param name="userId"> ID пользователя</param>
    /// <returns>ID созданного слоя</returns>
    public async Task<Guid> Create(CreateLayerDto dto, Guid userId)
    {
        var layer = new DAL.Layer
        {
            AppUserId = userId,
            Name = dto.Name!,
            ObjectsOnMap = new List<DAL.ObjectOnMap>(),
        };

        foreach (var id in dto.Objects)
        {
            layer.ObjectsOnMap.Add(await _objectOnMapRepository.FindById(id));
        }

        await _layerRepository.Create(layer);

        return layer.Id;
    }

    /// <summary>
    ///     Обнолвяет информацию о слое
    /// </summary>
    /// <param name="dto">DTO с информацией о слое</param>
    public async Task Update(UpdateLayerDto dto)
    {
        var layer = await _layerRepository.FindById((Guid) dto.Id);
        layer.Name = dto.Name;
        await _layerRepository.Update(layer);
    }

    /// <summary>
    ///     Удаляет слой по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
    public async Task Delete(Guid id)
    {
        var l = await _layerRepository.FindById(id);
        await _layerRepository.Remove(l);
    }

    /// <summary>
    ///     Добавляет объект на слой
    /// </summary>
    /// <param name="dto"> DTO с информацией о добавляемом объекте</param>
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

    /// <summary>
    ///     Удаляет объект со слоя
    /// </summary>
    /// <param name="dto"> DTO с информацией об удаляемом объекте</param>
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

