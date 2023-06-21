using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace DAL
{
    public class Layer : BaseModel, IOwnByUser
    {
        public string Name { get; set; }
        public virtual List<ObjectOnMap> ObjectsOnMap { get; set; }
        public bool IsSelectedByUser { get; set; }

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
