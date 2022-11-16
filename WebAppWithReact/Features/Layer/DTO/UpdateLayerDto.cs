using System.ComponentModel.DataAnnotations;


namespace WebAppWithReact.Features.Layer;

public record UpdateLayerDto
{
    [Required(ErrorMessage = "Id is required")]
    public Guid? Id { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }
}
