namespace DAL
{
    public class Layer : BaseModel, IOwnByUser
    {
        public string Name { get; set; }
        public virtual List<ObjectOnMap> ObjectsOnMap { get; set; }
        public bool IsSelectedByUser { get; set; }
        public double Alpha { get; set; } = 1;
        public Guid AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
    }
}
