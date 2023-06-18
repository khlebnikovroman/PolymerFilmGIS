using DAL;

using Mapster;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WebAppWithReact.Controllers;
using WebAppWithReact.Features.User.DTO;
using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.User;

public class UserController : BaseAuthorizedController
{
    private readonly IGenericRepository<UserSettings> _userSettingsRepository;

    public UserController(IGenericRepository<UserSettings> userSettingsRepository)
    {
        _userSettingsRepository = userSettingsRepository;
    }

    [HttpPut("UpdateSettings")]
    public async Task<ActionResult> UpdateSettings([FromBody] UpdateUserSettingsDTO dto)
    {
        var settings = (await _userSettingsRepository.Get(x => x.AppUserId == UserId)).First();

        dto.Adapt(settings);
        _userSettingsRepository.Update(settings);

        return Ok();
    }

    [HttpGet("GetSettings")]
    public async Task<ActionResult<GetUserSettingsDTO>> GetSettings()
    {
        var settings = (await _userSettingsRepository.Get(x => x.AppUserId == UserId));
        UserSettings superSettings;
        if (settings is null || settings.Count == 0)
        {
            superSettings = new UserSettings() {AppUserId = UserId};
            await _userSettingsRepository.Create(superSettings);
        }
        else
        {
            superSettings = settings.First();
        }
        return Ok(superSettings.Adapt<GetUserSettingsDTO>());
    }
}
