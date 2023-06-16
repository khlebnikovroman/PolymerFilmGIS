using DAL;


namespace ObjectsParsers;

public interface IObjectParser
{
    public (IReadOnlyCollection<Layer>, IReadOnlyCollection<ObjectOnMap>) Parse(string filePath);
}
