namespace WebAppWithReact.Features.Layer.DTO;

/// <summary>
///     DTO для добавления объекта на карту
/// </summary>
public record AddObjectToLayerDTO
{
    public Guid LayerId { get; set; }
    public Guid ObjectId { get; set; }
}



