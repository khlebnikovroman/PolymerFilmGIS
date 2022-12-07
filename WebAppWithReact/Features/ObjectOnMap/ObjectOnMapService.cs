using WebAppWithReact.Features.ObjectOnMap.DTO;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.ObjectOnMap;

public class ObjectOnMapService
{
    private readonly IGenericRepository<DAL.ObjectOnMap> _objectOnMapRepository;

    public ObjectOnMapService(IGenericRepository<DAL.ObjectOnMap> objectOnMapRepository)
    {
        _objectOnMapRepository = objectOnMapRepository;
    }

    public async Task<ObjectOnMapDetailsDto> Get(Guid id)
    {
        var o = await _objectOnMapRepository.FindById(id);

        var oDto = new ObjectOnMapDetailsDto
        {
            AppUserId = o.AppUserId,
            Id = o.Id,
            Name = o.Name,
            Capacity = o.Capacity,
            Lati = o.Lati,
            Long = o.Long,
        };

        return oDto;
    }

    public async Task<Guid> Create(CreateObjectOnMapDto dto, Guid userId)
    {
        var o = new DAL.ObjectOnMap
        {
            AppUserId = userId,
            Capacity = (double) dto.Capacity!,
            Lati = (double) dto.Lati!,
            Long = (double) dto.Long!,
            Name = dto.Name!,
        };

        await _objectOnMapRepository.Create(o);

        return o.Id;
    }

    public async Task Update(UpdateObjectOnMapDto dto)
    {
        var o = await _objectOnMapRepository.FindById((Guid) dto.Id);

        (o.Capacity, o.Lati, o.Long, o.Name) =
            ((double) dto.Capacity!, (double) dto.Lati!, (double) dto.Long!, dto.Name!);

        await _objectOnMapRepository.Update(o);
    }

    public async Task Delete(Guid id)
    {
        var o = await _objectOnMapRepository.FindById(id);
        await _objectOnMapRepository.Remove(o);
    }
}
