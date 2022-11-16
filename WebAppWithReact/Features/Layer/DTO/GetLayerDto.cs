using System.ComponentModel.DataAnnotations;


namespace WebAppWithReact.Features.Layer.DTO;

public record GetLayerDto
{
    [Required(ErrorMessage = "Id is required")]
    public Guid? Id { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }

    public IEnumerable<Guid>? Objects { get; set; }
}
