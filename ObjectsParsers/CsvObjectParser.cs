using System.Globalization;

using CsvHelper;

using DAL;


namespace ObjectsParsers;

public class CsvObjectParser : IObjectParser
{
    public (IReadOnlyCollection<Layer>, IReadOnlyCollection<ObjectOnMap>) Parse(string filePath)
    {
        using (var reader = new StreamReader(filePath))
        {
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                var objectOnMapList = new List<ObjectOnMap>();
                var layerSet = new HashSet<Layer>();

                csv.Read();
                csv.ReadHeader();

                while (csv.Read())
                {
                    var objectOnMap = new ObjectOnMap
                    {
                        Name = csv.GetField<string>("Name"),
                        Lati = csv.GetField<double>("Lati"),
                        Long = csv.GetField<double>("Long"),
                        Capacity = csv.GetField<double>("Capacity"),
                    };

                    var layerName = csv.GetField<string>("LayerName");

                    if (!string.IsNullOrEmpty(layerName))
                    {
                        var layer = layerSet.FirstOrDefault(l => l.Name == layerName);

                        if (layer == null)
                        {
                            layer = new Layer {Name = layerName, ObjectsOnMap = new List<ObjectOnMap>(),};
                            layerSet.Add(layer);
                        }

                        objectOnMap.Layer = layer;
                    }

                    objectOnMapList.Add(objectOnMap);
                }

                return (layerSet, objectOnMapList);
            }
        }
    }
}
