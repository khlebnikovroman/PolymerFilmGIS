using DAL;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAppWithReact.Controllers;
using WebAppWithReact.Features.User.DTO;
using WebAppWithReact.Misc.AuthHandlers;
using WebAppWithReact.Repositories;

namespace WebAppWithReact.Features.User;

public class UserController : BaseAuthorizedController
{
    private readonly IGenericRepository<DAL.UserSettings> _userSettingsRepository;
    private readonly IAuthorizationService _authorizationService;

    public UserController(IGenericRepository<UserSettings> userSettingsRepository, IAuthorizationService authorizationService)
    {
        _userSettingsRepository = userSettingsRepository;
        _authorizationService = authorizationService;
    }
    [HttpPut("UpdateSettings")]
    public async Task<ActionResult> UpdateSettings([FromBody] UpdateUserSettingsDTO dto)
    {
        var settings = await _userSettingsRepository.FindById(dto.AppUserId);
        var authorizeResult = await _authorizationService.AuthorizeAsync(User, settings, Policies.IsObjectOwnByUser);

        if (authorizeResult.Succeeded)
        {
            dto.Adapt(settings);
            return Ok();
        }

        return Forbid();
    }
}