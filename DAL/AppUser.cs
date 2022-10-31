using DAL.Migrations;

using Microsoft.AspNetCore.Identity;


namespace Models
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

        public IEnumerable<ObjectOnMap> UsersObjects { get; set; }
        public IEnumerable<Layer> Layers { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
