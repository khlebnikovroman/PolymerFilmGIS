using System.ComponentModel.DataAnnotations.Schema;


namespace Models
{
    public abstract class BaseModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
    }
}
