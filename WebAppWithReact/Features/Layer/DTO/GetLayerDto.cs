using System.ComponentModel.DataAnnotations;

using WebAppWithReact.Features.ObjectOnMap.DTO;


namespace WebAppWithReact.Features.Layer.DTO;

/// <summary>
///     DTO для получения информации о слое
/// </summary>
public record GetLayerDto
{
    [Required(ErrorMessage = "Id is required")]
    public Guid? Id { get; set; }

    [Required(ErrorMessage = "Name is required")]
    public string? Name { get; set; }

    public List<GetObjectOnMapDto> Objects { get; set; }
}




