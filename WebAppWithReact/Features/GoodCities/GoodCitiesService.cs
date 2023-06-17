using System.Text.Json;

using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.GoodCities;

public class Point
{
    private double _x;
    private double _y;

    public Point()
    {
    }

    public Point(List<double> xy)
    {
        if (xy.Count != 2)
        {
            throw new ArgumentException();
        }

        X = xy[0];
        Y = xy[1];
    }

    public Point(double x, double y)
    {
        X = x;
        Y = y;
    }

    public Point(Point point)
    {
        X = point.X;
        Y = point.Y;
    }

    public double X
    {
        get => _x;
        set
        {
            if (value > 180 || value < -180)
            {
                throw new ArgumentOutOfRangeException("X", value, "Must be in [-180; 180]");
            }

            _x = value;
        }
    }

    public double Y
    {
        get => _y;
        set
        {
            if (value > 90 || value < -90)
            {
                throw new ArgumentOutOfRangeException("Y", value, "Must be in [-90; 90]");
            }

            _y = value;
        }
    }

    public List<double> ToList()
    {
        return new List<double>
            {X, Y,};
    }
}


public class PointWithValue : Point
{
    public PointWithValue(Point point)
    {
        X = point.X;
        Y = point.Y;
    }

    public PointWithValue(double x, double y) : base(x, y)
    {
    }

    public PointWithValue(List<double> calculate) : base(calculate)
    {
    }

    public double value { get; set; }
}


public class Area
{
    public Point LeftBottom;
    public Point RightTop;

    public Area(Point leftBottom, Point rightTop)
    {
        LeftBottom = leftBottom;
        RightTop = rightTop;
    }
}


public class GoodCitiesService : IGoodCitiesService
{
    private readonly IGenericRepository<DAL.Layer> _layerRepository;

    public GoodCitiesService(IGenericRepository<DAL.Layer> layerRepository)
    {
        _layerRepository = layerRepository;
    }

    public async Task<List<CityDto>> GetGoodCities(Guid userId)
    {
        var threshold = 0.8;

        if (threshold < 0 || threshold > 1)
        {
            throw new ArgumentOutOfRangeException(nameof(threshold), threshold, "Must be in (0; 1)");
        }

        var userActiveLayers = await _layerRepository.Get(x => x.AppUserId == userId && x.IsSelectedByUser);
        List<PointWithValue> minExtremums;
        List<PointWithValue> maxExtremums;
        (minExtremums, maxExtremums) = GetLocalExtremums(userActiveLayers);
        var minPoint = minExtremums.MinBy(x => x.value);
        var maxPoint = maxExtremums.MaxBy(x => x.value);
        var Areas = new List<Area>();

        foreach (var maxExtremum in maxExtremums)
        {
            Areas.Add(FindAreaAroundPoint(maxExtremum, userActiveLayers, minPoint.value, maxPoint.value, threshold));
        }

        return null;
    }

    public Area FindAreaAroundPoint(Point point, List<DAL.Layer> layers, double min, double max, double threshold)
    {
        if (!IsBiggerThanThreshold(point, layers, min, max, threshold))
        {
            return null;
        }

        var step = 0.001;
        var currentPoint = new Point(point);
        var left = point.X;
        var right = point.X;
        var top = point.X;
        var bottom = point.Y;

        //идем вправо от точки
        while (IsBiggerThanThreshold(currentPoint, layers, min, max, threshold))
        {
            try
            {
                currentPoint.X += step;
            }
            catch (ArgumentOutOfRangeException)
            {
                break;
            }
        }

        right = currentPoint.X;
        currentPoint = new Point(point);

        //идем влево от точки
        while (IsBiggerThanThreshold(currentPoint, layers, min, max, threshold))
        {
            try
            {
                currentPoint.X -= step;
            }
            catch (ArgumentOutOfRangeException)
            {
                break;
            }
        }

        left = currentPoint.X;
        currentPoint = new Point(point);

        //идем наверх от точки
        while (IsBiggerThanThreshold(currentPoint, layers, min, max, threshold))
        {
            try
            {
                currentPoint.Y += step;
            }
            catch (ArgumentOutOfRangeException)
            {
                break;
            }
        }

        top = currentPoint.Y;
        currentPoint = new Point(point);

        //идем вниз от точки
        while (IsBiggerThanThreshold(currentPoint, layers, min, max, threshold))
        {
            try
            {
                currentPoint.Y -= step;
            }
            catch (ArgumentOutOfRangeException)
            {
                break;
            }
        }

        bottom = currentPoint.Y;
        currentPoint = new Point(point);

        return new Area(new Point(left, bottom), new Point(right, top));
    }

    public bool IsBiggerThanThreshold(Point point, List<DAL.Layer> layers, double min, double max, double threshold)
    {
        return Normalize(WeightInPoint(point, layers), min, max) < threshold;
    }

    private double GaussFunction(double x, double y, double x0, double y0, double k, double a)
    {
        var exponent = -(Math.Pow(x - x0, 2) + Math.Pow(y - y0, 2) / Math.Pow(Math.Abs(k), a));

        return k * Math.Exp(exponent);
    }

    private double WeightInPoint(Point point, List<DAL.Layer> layers)
    {
        var weight = 0.0;

        foreach (var layer in layers)
        {
            foreach (var objectOnMap in layer.ObjectsOnMap)
            {
                weight += GaussFunction(point.X, point.Y, objectOnMap.Long, objectOnMap.Lati, objectOnMap.Capacity, layer.Alpha);
            }
        }

        return weight;
    }

    // private async Task<(double min, double max)> GetMinMaxInRussia(Guid userId)
    // {
    //     var min = double.PositiveInfinity;
    //     var max = double.NegativeInfinity;
    //     var userActiveLayers = await _layerRepository.Get(x => x.AppUserId == userId && x.IsSelectedByUser);
    //     var xLeft = 19.0;
    //     var xRight = 179.9;
    //     var yBottom = 41.0;
    //     var yTop = 81.0;
    //     var xStep = (xRight - xLeft) / 200;
    //     var yCount = (int) ((yTop - yBottom) / xStep);
    //     var yStep = (yTop - yBottom) / yCount;
    //
    //     var point = new Point();
    //     for (var x = xLeft; x <= xRight; x+=xStep)
    //     {
    //         for (var y = yBottom; y <= yTop; y+=yStep)
    //         {
    //             point.x = x;
    //             point.y = y;
    //             var weight = WeightInPoint(point, userActiveLayers);
    //             min = Math.Min(min, weight);
    //             max = Math.Max(max, weight);
    //         }
    //     }
    //
    //     return (min, max);
    // }

    private (List<PointWithValue>, List<PointWithValue>) GetLocalExtremums(List<DAL.Layer> userActiveLayers)
    {
        var MinExtremums = new List<PointWithValue>();
        var MaxExtremums = new List<PointWithValue>();

        foreach (var layer in userActiveLayers)
        {
            foreach (var objectOnMap in layer.ObjectsOnMap)
            {
                var localMin = GetLocalExtremum(new Point(objectOnMap.Long, objectOnMap.Lati), userActiveLayers, ExtremumType.Min);
                var localMax = GetLocalExtremum(new Point(objectOnMap.Long, objectOnMap.Lati), userActiveLayers, ExtremumType.Max);
                MinExtremums.Add(localMin);
                MaxExtremums.Add(localMax);
            }
        }

        return (MinExtremums, MaxExtremums);
    }

    private double Normalize(double value, double min, double max)
    {
        return (value - min) / (max - min);
    }


    private PointWithValue GetLocalExtremum(Point startPoint, List<DAL.Layer> layers, ExtremumType extremumType)
    {
        Func<List<double>, double> func;
        PointWithValue extremumPoint;

        switch (extremumType)
        {
            case ExtremumType.Min:
                func = x => -WeightInPoint(new Point(x), layers);
                extremumPoint = new PointWithValue(GradientDescent.Calculate(startPoint.ToList(), func));
                extremumPoint.value = -func(startPoint.ToList());

                return extremumPoint;

                break;
            case ExtremumType.Max:
                func = x => WeightInPoint(new Point(x), layers);
                extremumPoint = new PointWithValue(GradientDescent.Calculate(startPoint.ToList(), func));
                extremumPoint.value = func(startPoint.ToList());

                return extremumPoint;

                break;
            default:
                throw new ArgumentException();
        }
    }


    private enum ExtremumType
    {
        Min,
        Max,
    }
}


public class RootObject
{
    public List<Element> Elements { get; set; }
}


public class Element
{
    public string Type { get; set; }
    public long Id { get; set; }
    public double Lat { get; set; }
    public double Lon { get; set; }
    public Tags Tags { get; set; }
}


public class Tags
{
    public string Name { get; set; }
    public string AddrCountry { get; set; }
    public string AddrRegion { get; set; }
    public int Population { get; set; }
}


public static class OsmClient
{
    private static JsonSerializerOptions _options = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public static async Task<List<CityDto>> GetCitiesInArea(Area area)
    {
        var url =
            $"https://overpass-api.de/api/interpreter?data=[out:json];(node[%22place%22=%22city%22]" +
            $"({area.LeftBottom.X},{area.LeftBottom.Y},{area.RightTop.X},{area.RightTop.Y});way[%22place%22=%22city%22]" +
            $"({area.LeftBottom.X},{area.LeftBottom.Y},{area.RightTop.X},{area.RightTop.Y}););out;";

        var json = await GetDataFromApi(url);
        var rootObject = JsonSerializer.Deserialize<RootObject>(json);

        var cities = rootObject.Elements.Select(e => new CityDto
        {
            Name = e.Tags.Name,
            Lat = e.Lat,
            Lng = e.Lon,
            Population = e.Tags.Population,
        }).ToList();

        return cities;
    }

    private static async Task CheckAndSetRailway(CityDto city)
    {
        var around = 10000;

        var url = $"https://overpass-api.de/api/interpreter?data=[out:json];" +
                  $"%20node[%22railway%22=%22station%22][%22subway%22!=%22yes%22]%20(around:{around},{city.Lat},{city.Lng})%20;%20out%20count;";

        var json = await GetDataFromApi(url);
        var jsonObject = JsonSerializer.Deserialize<dynamic>(json);
        var nodesValue = int.Parse(jsonObject["elements"][0]["tags"]["nodes"]);

        if (nodesValue > 0)
        {
            city.IsRailwayNearby = true;
        }
    }

    private static async Task<string> GetDataFromApi(string url)
    {
        using (var client = new HttpClient())
        {
            var response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            var json = await response.Content.ReadAsStringAsync();

            return json;
        }
    }
}


public static class GradientDescent
{
    public static List<double> Calculate(List<double> startPoint,
                                         Func<List<double>, double> function)
    {
        double alpha = 1;
        var alphaDecreaseRate = 0.9;
        var currentPoint = startPoint;

        while (true)
        {
            var currentValue = function(currentPoint);
            var newPoint = new List<double>();

            for (var i = 0; i < currentPoint.Count; i++)
            {
                Func<double, double> func = x =>
                    function(CopyPointWithReplace(currentPoint, x, i));

                newPoint.Add(currentPoint[i] -
                             alpha * (1.0 / Convert.ToDouble(startPoint.Count)) *
                             GetDerivative(func, currentPoint[i], 0.001));
            }

            var newValue = function(newPoint);

            if (newValue < currentValue)
            {
                alpha *= alphaDecreaseRate;
            }
            else
            {
                if (currentValue - newValue <= 0.001)
                {
                    return newPoint;
                }

                currentPoint = newPoint;
            }
        }
    }

    private static List<double> CopyPointWithReplace(List<double> point,
                                                     double replace, int replaceIndex)
    {
        var result = new List<double>();

        for (var i = 0; i < point.Count; i++)
        {
            if (i == replaceIndex)
            {
                result.Add(replace);
            }
            else
            {
                result.Add(point[i]);
            }
        }

        return result;
    }

    private static double GetDerivative(Func<double, double> function,
                                        double point, double delta)
    {
        return (function(point + delta) - function(point - delta)) /
               (2 * delta);
    }
}
