using System.ComponentModel.DataAnnotations;


namespace WebAppWithReact.Features.Layer.DTO;

public class SetLayerSelectionDto
{
    [Required]
    public Guid LayerId { get; set; }

    [Required]
    public bool Selection { get; set; }
}
