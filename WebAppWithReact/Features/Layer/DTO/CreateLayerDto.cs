using System.ComponentModel.DataAnnotations;


namespace WebAppWithReact.Features.Layer;

/// <summary>
///     DTO для создания слоя
/// </summary>
public record CreateLayerDto
{
    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }

    public IEnumerable<Guid>? Objects { get; set; }
}

