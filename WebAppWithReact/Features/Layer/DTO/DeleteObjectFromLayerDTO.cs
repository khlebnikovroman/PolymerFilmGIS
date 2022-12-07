namespace WebAppWithReact.Features.Layer.DTO;

public record DeleteObjectFromLayerDTO
{
    public Guid LayerId { get; set; }
    public Guid ObjectId { get; set; }
}
