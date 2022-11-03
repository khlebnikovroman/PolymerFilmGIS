using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using Models;

using WebAppWithReact.Extensions;
using WebAppWithReact.ModelsAndDTO.ObjectOnMap.DTO;
using WebAppWithReact.ModelsAndDTO.ObjectOnMap.Quarries;


namespace WebAppWithReact.Controllers;

public class ObjectOnMapController : BaseAuthorizedController
{
    private readonly IConfiguration _configuration;
    private readonly Context _db;
    private readonly RoleManager<IdentityRole<Guid>> _roleManager;
    private readonly UserManager<AppUser> _userManager;

    public ObjectOnMapController(Context context, UserManager<AppUser> userManager,
                                 RoleManager<IdentityRole<Guid>> roleManager,
                                 IConfiguration configuration)
    {
        _db = context;
        _configuration = configuration;
        _roleManager = roleManager;
        _userManager = userManager;
    }

    private Guid UserId => User.GetLoggedInUserId<Guid>();

    // todo переписать (сейчас это заглушка)
    [HttpGet]
    [Route("getall")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IReadOnlyCollection<ObjectOnMapDto>))]
    public async Task<IActionResult> Get()
    {
        await _db.ObjectsOnMap.LoadAsync();

        var l = await _db.ObjectsOnMap
                         .Where(o => o.AppUserId == UserId)
                         .ToListAsync();

        return Ok(l);
    }

    [HttpGet]
    [Route("get")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ObjectOnMapDetailsDto))]
    public async Task<IActionResult> Get([FromBody] Guid id)
    {
        var o = _db.ObjectsOnMap.Find(id);

        if (o is not null)
        {
            if (o.AppUserId == UserId || User.IsInRole(UserRoles.Admin))
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

                return Ok(oDto);
            }

            return Forbid();
        }

        return NotFound();
    }

    [HttpPost]
    [Route("create")]
    public async Task<IActionResult> Create([FromBody] CreateObjectOnMapDto dto)
    {
        var o = new ObjectOnMap
        {
            AppUserId = UserId,
            Capacity = (double) dto.Capacity!,
            Lati = (double) dto.Lati!,
            Long = (double) dto.Long!,
            Name = dto.Name!,
        };

        await _db.ObjectsOnMap.AddAsync(o);
        await _db.SaveChangesAsync();

        return Ok();
    }

    [HttpPut]
    [Route("update")]
    public async Task<IActionResult> Update([FromBody] UpdateObjectOnMapDto dto)
    {
        var o = _db.ObjectsOnMap.Find(dto.Id);

        if (o is not null)
        {
            if (o.AppUserId == UserId || User.IsInRole(UserRoles.Admin))
            {
                (o.Capacity, o.Lati, o.Long, o.Name) =
                    ((double) dto.Capacity!, (double) dto.Lati!, (double) dto.Long!, dto.Name!);

                await _db.SaveChangesAsync();

                return Ok();
            }

            return Forbid();
        }

        return NotFound();
    }

    [HttpDelete]
    [Route("delete")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(ObjectOnMapDetailsDto))]
    public async Task<IActionResult> Delete([FromBody] Guid id)
    {
        var o = await _db.ObjectsOnMap.FindAsync(id);

        if (o is not null)
        {
            if (o.AppUserId == UserId || User.IsInRole(UserRoles.Admin))
            {
                _db.Remove(o);
                await _db.SaveChangesAsync();

                return Ok();
            }

            return Forbid();
        }

        return NotFound();
    }
}
