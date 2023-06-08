using Mapster;

using Microsoft.AspNetCore.Authorization;

using WebAppWithReact.Features.Layer.DTO;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.Layer;

public class LayerService
{
    private readonly IAuthorizationService _authorizationService;
    private readonly IGenericRepository<DAL.Layer> _layerRepository;
    private readonly IGenericRepository<DAL.ObjectOnMap> _objectOnMapRepository;

    public LayerService(IGenericRepository<DAL.Layer> layerRepository,
                        IGenericRepository<DAL.ObjectOnMap> objectOnMapRepository,
                        IAuthorizationService authorizationService)
    {
        _layerRepository = layerRepository;
        _objectOnMapRepository = objectOnMapRepository;
        _authorizationService = authorizationService;
    }

    public async Task<IReadOnlyCollection<GetLayerDto>> GetAll()
    {
        var l = await _layerRepository.Get();
        var dtos = l.Adapt<List<GetLayerDto>>();

        return dtos;
    }

    /// <summary>
    ///     Получает слой по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
    /// <returns>Информация о найденном слое</returns>
    public async Task<GetLayerDto> Get(Guid id)
    {
        var l = await _layerRepository.FindById(id);

        var layer = l.Adapt<GetLayerDto>();

        return layer;
    }

    /// <summary>
    ///     Создает слой
    /// </summary>
    /// <param name="dto">DTO с информацией о создаваемом объекте</param>
    /// <param name="userId"> ID пользователя</param>
    /// <returns>ID созданного слоя</returns>
    public async Task<Guid> Create(CreateLayerDto dto, Guid userId)
    {
        var layer = dto.Adapt<DAL.Layer>();
        layer.AppUserId = userId;
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
        dto.Adapt(layer);

        if (dto.Objects is not null)
        {
            layer.ObjectsOnMap.Clear();

            foreach (var oId in dto.Objects)
            {
                var o = await _objectOnMapRepository.FindById(oId);
                layer.ObjectsOnMap.Add(o);
            }
        }

        await _layerRepository.Update(layer);
    }

    /// <summary>
    ///     Удаляет слой по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
    public async Task Delete(Guid id)
    {
        var layerToDelete = await _layerRepository.FindById(id);
        layerToDelete.ObjectsOnMap.Clear();
        await _layerRepository.Update(layerToDelete);
        await _layerRepository.Remove(layerToDelete);
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
    
    /// <summary>
    ///     Отмечает слой как выбранный пользователем, по ID слоя
    /// </summary>
    /// <param name="dto">DTO с информацией о выбранном слое</param>
    /// <returns></returns>
    public async Task SetSelection(SetLayerSelectionDto dto)
    {
        var l = await _layerRepository.FindById(dto.LayerId);
        l.IsSelectedByUser = dto.Selection;
        await _layerRepository.Update(l);
    }
}
