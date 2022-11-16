using System.Security.Claims;

using DAL;

using WebAppWithReact.Extensions;
using WebAppWithReact.Features.ObjectOnMap.DTO;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.ObjectOnMap;

public class ObjectOnMapService
{
    private readonly IGenericRepository<DAL.ObjectOnMap> _objectOnMapRepository;
    private readonly ClaimsPrincipal _user;

    public ObjectOnMapService(IGenericRepository<DAL.ObjectOnMap> objectOnMapRepository, ClaimsPrincipal user)
    {
        _objectOnMapRepository = objectOnMapRepository;
        _user = user;
    }

    private bool IsAdmin => _user.IsInRole(UserRoles.Admin);

    private Guid UserId => _user.GetLoggedInUserId<Guid>();

    //todo правильные ли исключения?
    // todo структура очень похожа для многих методов и сервисов, мб ее обернуть в страгегию/шаблонный метод
    // т.е. будет функция проверки на нулл будет вызывать функцию вынесенную из 33-43 строк
    // todo мэппинг наверное для такого объема не нужен
    // функцию *добавиьт объект на слой* нужно писать в сервисе слоя или объекта? аналогично с контроллером
    public async Task<ObjectOnMapDetailsDto> Get(Guid id)
    {
        var o = await _objectOnMapRepository.FindById(id);

        if (o is not null)
        {
            if (CanUserAccess(o))
            {
                var oDto = new ObjectOnMapDetailsDto
                {
                    AppUserId = UserId,
                    Id = o.Id,
                    Name = o.Name,
                    Capacity = o.Capacity,
                    Lati = o.Lati,
                    Long = o.Long,
                };

                return oDto;
            }

            throw new UnauthorizedAccessException();
        }

        throw new KeyNotFoundException();
    }

    public async Task<Guid> Create(CreateObjectOnMapDto dto)
    {
        var o = new DAL.ObjectOnMap
        {
            AppUserId = UserId,
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

        if (o is not null)
        {
            if (CanUserAccess(o))
            {
                (o.Capacity, o.Lati, o.Long, o.Name) =
                    ((double) dto.Capacity!, (double) dto.Lati!, (double) dto.Long!, dto.Name!);

                await _objectOnMapRepository.Update(o);

                return;
            }

            throw new UnauthorizedAccessException();
        }

        throw new KeyNotFoundException();
    }

    public async Task Delete(Guid id)
    {
        var o = await _objectOnMapRepository.FindById(id);

        if (o is not null)
        {
            if (CanUserAccess(o))
            {
                await _objectOnMapRepository.Remove(o);

                return;
            }

            throw new UnauthorizedAccessException();
        }

        throw new KeyNotFoundException();
    }

    // todo Эта фукнция повсюду одна и та же, возможно с ней что-то можнно сделать? DRY все дела...
    private bool CanUserAccess(DAL.ObjectOnMap o)
    {
        return IsAdmin || IsOwnByUser(o);
    }

    private bool IsOwnByUser(DAL.ObjectOnMap o)
    {
        return o.AppUserId == UserId;
    }
}
