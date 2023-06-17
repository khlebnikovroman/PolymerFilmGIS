namespace DAL;

public class UserSettings : BaseModel, IOwnByUser
{
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; }
    public bool IsNeedToDrawHeatMap { get; set; }
}