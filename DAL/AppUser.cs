using Microsoft.AspNetCore.Identity;


namespace DAL
{
    public class AppUser : IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string SecondName { get; set; }

        public string FullName
        {
            get
            {
                return FirstName + " " + SecondName;
            }
        }

        public List<ObjectOnMap> UsersObjects { get; set; }
        public List<Layer> Layers { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
