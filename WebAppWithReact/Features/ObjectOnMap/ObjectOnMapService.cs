using Mapster;

using WebAppWithReact.Features.ObjectOnMap.DTO;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.ObjectOnMap;

/// <summary>
///     Сервис для работы с объектами
/// </summary>
public class ObjectOnMapService
{
    private readonly IGenericRepository<DAL.ObjectOnMap> _objectOnMapRepository;


    public ObjectOnMapService(IGenericRepository<DAL.ObjectOnMap> objectOnMapRepository)
    {
        _objectOnMapRepository = objectOnMapRepository;
    }

    /// <summary>
    ///     Получает слой по ID
    /// </summary>
    /// <param name="id">ID слоя</param>
    /// <returns>DTO с информацией о найденном объекте</returns>
    public async Task<GetObjectOnMapDto> Get(Guid id)
    {
        var o = await _objectOnMapRepository.FindById(id);

        var oDto = o.Adapt<GetObjectOnMapDto>();

        return oDto;
    }

    /// <summary>
    ///     Создает объект
    /// </summary>
    /// <param name="dto">DTO с информацией об объекте</param>
    /// <param name="userId">ID пользователя, кому принадлежит объект</param>
    /// <returns>ID созданного объекта</returns>
    public async Task<Guid> Create(CreateObjectOnMapDto dto, Guid userId)
    {
        var o = dto.Adapt<DAL.ObjectOnMap>();
        o.AppUserId = userId;
        await _objectOnMapRepository.Create(o);

        return o.Id;
    }

    /// <summary>
    ///     Обновляет объект
    /// </summary>
    /// <param name="dto"> DTO с обновленной информацией об объекте</param>
    public async Task Update(UpdateObjectOnMapDto dto)
    {
        var o = await _objectOnMapRepository.FindById((Guid) dto.Id);
        dto.Adapt(o);
        await _objectOnMapRepository.Update(o);
    }

    /// <summary>
    ///     Удаляет объект по ID
    /// </summary>
    /// <param name="id">ID объекта</param>
    public async Task Delete(Guid id)
    {
        var o = await _objectOnMapRepository.FindById(id);
        await _objectOnMapRepository.Remove(o);
    }
}




