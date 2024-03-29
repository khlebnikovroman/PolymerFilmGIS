﻿using System.ComponentModel.DataAnnotations;

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

        public virtual List<ObjectOnMap> UsersObjects { get; set; }
        public virtual List<Layer> Layers { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }

        [Display(AutoGenerateField = false)]
        public Guid UserSettingsId { get; set; }

        [Display(AutoGenerateField = false)]
        public virtual UserSettings UserSettings { get; set; } = new();

        public override string ToString()
        {
            return UserName;
        }
    }
}
