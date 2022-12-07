namespace DAL
{
    public class Layer : BaseModel, IOwnByUser
    {
        public string Name { get; set; }
        public List<ObjectOnMap> ObjectsOnMap { get; set; }
        public Guid AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}
