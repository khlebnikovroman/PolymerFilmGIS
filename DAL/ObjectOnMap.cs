using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace DAL
{
    public class ObjectOnMap : BaseModel, IOwnByUser
    {
        public string Name { get; set; }
        public double Lati { get; set; }
        public double Long { get; set; }
        public double Capacity { get; set; }

        [Display(AutoGenerateField = false)]
        public Guid? LayerId { get; set; }

        [ForeignKey("LayerId")]
        public virtual Layer Layer { get; set; }

        [Display(AutoGenerateField = false)]
        public Guid AppUserId { get; set; }

        [ForeignKey("AppUserId")]
        public virtual AppUser AppUser { get; set; }

        public override string ToString()
        {
            return Name;
        }
    }
}
