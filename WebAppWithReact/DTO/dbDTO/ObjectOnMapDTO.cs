namespace WebAppWithReact.DTO.dbDTO
{
    public record ObjectOnMapDTO
    {
        public string Name { get; init; }
        public double Lati { get; init; }
        public double Long { get; init; }
        public double Capacity { get; init; }
    }
}
