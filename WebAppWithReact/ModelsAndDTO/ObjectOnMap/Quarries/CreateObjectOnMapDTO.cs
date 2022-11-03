using System.ComponentModel.DataAnnotations;


namespace WebAppWithReact.ModelsAndDTO.ObjectOnMap.Quarries
{
    public class CreateObjectOnMapDto
    {
        [Required(ErrorMessage = "Name is required")]
        public string? Name { get; set; }

        [Required(ErrorMessage = "Lati is required")]
        public double? Lati { get; set; }

        [Required(ErrorMessage = "Long is required")]
        public double? Long { get; set; }

        [Required(ErrorMessage = "Capacity is required")]
        public double? Capacity { get; set; }
    }
}
