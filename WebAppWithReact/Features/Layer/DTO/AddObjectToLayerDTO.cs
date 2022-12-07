namespace WebAppWithReact.Features.Layer.DTO;

public record AddObjectToLayerDTO
{
    public Guid LayerId { get; set; }
    public Guid ObjectId { get; set; }
}
