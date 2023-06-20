using System.ComponentModel.DataAnnotations;


namespace WebAppWithReact.Features.Layer;

/// <summary>
///     DTO для обновления информации о слое
/// </summary>
public record UpdateLayerDto
{
    [Required(ErrorMessage = "Id is required")]
    public Guid? Id { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }

    [Required(ErrorMessage = "Selection is required")]
    public bool IsSelectedByUser { get; set; }

    [Required(ErrorMessage = "Objects is required")]
    public IReadOnlyCollection<Guid> Objects { get; set; }
}
