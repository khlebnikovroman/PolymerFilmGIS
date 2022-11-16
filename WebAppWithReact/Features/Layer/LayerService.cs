using System.Security.Claims;

using DAL;

using WebAppWithReact.Extensions;
using WebAppWithReact.Features.Layer.DTO;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.Layer;

public class LayerService
{
    private readonly IGenericRepository<DAL.Layer> _layerRepository;
    private readonly IGenericRepository<DAL.ObjectOnMap> _objectOnMapRepository;
    private readonly ClaimsPrincipal _user;

    public LayerService(IGenericRepository<DAL.Layer> layerRepository, ClaimsPrincipal user,
                        IGenericRepository<DAL.ObjectOnMap> objectOnMapRepository)
    {
        _layerRepository = layerRepository;
        _user = user;
        _objectOnMapRepository = objectOnMapRepository;
    }

    private bool IsAdmin => _user.IsInRole(UserRoles.Admin);

    private Guid UserId => _user.GetLoggedInUserId<Guid>();

    public async Task<GetLayerDto> Get(Guid id)
    {
        var l = await _layerRepository.FindById(id);

        if (l is not null)
        {
            if (CanUserAccess(l))
            {
                var oDto = new GetLayerDto
                {
                    Id = l.Id,
                    Name = l.Name,
                    Objects = l.ObjectsOnMap.Select(o => o.Id),
                };

                return oDto;
            }

            throw new UnauthorizedAccessException();
        }

        throw new KeyNotFoundException();
    }

    public async Task<Guid> Create(CreateLayerDto dto)
    {
        var layer = new DAL.Layer
        {
            AppUserId = UserId,
            Name = dto.Name!,
            ObjectsOnMap = new List<DAL.ObjectOnMap>(),
        };

        await _layerRepository.Create(layer);

        return layer.Id;
    }

    public async Task Update(UpdateLayerDto dto)
    {
        var layer = await _layerRepository.FindById((Guid) dto.Id);

        if (layer is not null)
        {
            if (CanUserAccess(layer))
            {
                layer.Name = dto.Name;
                await _layerRepository.Update(layer);

                return;
            }

            throw new UnauthorizedAccessException();
        }

        throw new KeyNotFoundException();
    }

    private bool CanUserAccess(DAL.Layer l)
    {
        return IsAdmin || IsOwnByUser(l);
    }

    private bool IsOwnByUser(DAL.Layer l)
    {
        return l.AppUserId == UserId;
    }
}
