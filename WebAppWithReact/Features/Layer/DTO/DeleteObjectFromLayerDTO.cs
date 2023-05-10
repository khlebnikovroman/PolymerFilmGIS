namespace WebAppWithReact.Features.Layer.DTO;

/// <summary>
///     DTO для удаления объекта со слоя
/// </summary>
public record DeleteObjectFromLayerDTO
{
    public Guid LayerId { get; set; }
    public Guid ObjectId { get; set; }
}



