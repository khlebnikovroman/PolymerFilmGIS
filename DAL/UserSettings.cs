namespace DAL;

public class UserSettings : BaseModel, IOwnByUser
{
    public bool IsNeedToDrawHeatMap { get; set; }
    public Guid AppUserId { get; set; }
    public virtual AppUser AppUser { get; set; }
}
