using DAL;

namespace WebAppWithReact.Features.User.DTO;

public class UpdateUserSettingsDTO
{
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; }
    public bool IsNeedToDrawHeatMap { get; set; }
}