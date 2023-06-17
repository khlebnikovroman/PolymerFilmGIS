using DAL;
using Microsoft.AspNetCore.Mvc;
using WebAppWithReact.Controllers;
using WebAppWithReact.Features.User.DTO;
using WebAppWithReact.Repositories;

namespace WebAppWithReact.Features.User;

public class UserController : BaseAuthorizedController
{
    private readonly IGenericRepository<DAL.UserSettings> _userSettingsRepository;
    public UserController(IGenericRepository<UserSettings> userSettingsRepository)
    {
        _userSettingsRepository = userSettingsRepository;
    }
    [HttpPut("UpdateSettings")]
    public Task<ActionResult> UpdateSettings(UpdateUserSettingsDTO dto)
    {
        
        return Ok();
    }
}