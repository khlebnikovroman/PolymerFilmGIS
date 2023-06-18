using System.Globalization;
using System.Text.Json;

using WebAppWithReact.Repositories;


namespace WebAppWithReact.Features.GoodCities;

public class Point
{
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

    public double X { get; set; }

    public double Y { get; set; }
}


public class PointWithValue : Point
{
    public PointWithValue(Point point) : base(point)
    {
    }

    public PointWithValue(double x, double y) : base(x, y)
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
        var multiplier = GetNormalizeMultiplier(userActiveLayers, 2);
        List<PointWithValue> minExtremums;
        List<PointWithValue> maxExtremums;
        NormalizeObjectsCapacity(userActiveLayers, multiplier);
        (minExtremums, maxExtremums) = GetLocalExtremums(userActiveLayers);
        var minPoint = minExtremums.MinBy(x => x.value);
        var maxPoint = maxExtremums.MaxBy(x => x.value);

        var areas = new List<Area>();

        foreach (var maxExtremum in maxExtremums)
        {
            var area = FindAreaAroundPoint(maxExtremum, userActiveLayers, minPoint.value, maxPoint.value, threshold);

            if (area is not null)
            {
                areas.Add(area);
            }
        }

        var cities = new List<CityDto>();

        foreach (var area in areas)
        {
            cities.AddRange(await OsmClient.GetCitiesInArea(area));
        }

        cities = cities.DistinctBy(x => x.Name).OrderByDescending(x => x.IsRailwayNearby).ThenByDescending(x => x.Population).ToList();

        return cities;
    }


    private double GetNormalizeMultiplier(List<DAL.Layer> layers, double maxRadiusInDegrees)
    {
        var objectWithMaxK = layers.SelectMany(x => x.ObjectsOnMap)
                                   .MaxBy(x => x.Capacity);

        var a = objectWithMaxK.Layer.Alpha;
        var k = objectWithMaxK.Capacity;
        var normK = Math.Pow(2 * Math.Pow(maxRadiusInDegrees, 2) / 9, 1 / a);
        var multiplier = k / normK;

        return multiplier;
    }

    private void NormalizeObjectsCapacity(List<DAL.Layer> layers, double multiplier)
    {
        foreach (var layer in layers)
        {
            foreach (var objectOnMap in layer.ObjectsOnMap)
            {
                objectOnMap.Capacity /= multiplier;
            }
        }
    }

    public Area FindAreaAroundPoint(Point point, List<DAL.Layer> layers, double min, double max, double threshold)
    {
        if (!IsBiggerThanThreshold(point, layers, min, max, threshold))
        {
            return null;
        }

        var step = 0.01;
        var currentPoint = new Point(point);
        var left = point.X;
        var right = point.X;
        var top = point.Y;
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
                currentPoint.Y += step * 2;
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
        return Normalize(WeightInPoint(point, layers), min, max) > threshold;
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
        Func<double, double, double> func;
        PointWithValue extremumPoint;

        switch (extremumType)
        {
            case ExtremumType.Min:
                func = (x, y) => WeightInPoint(new Point(x, y), layers);
                extremumPoint = new PointWithValue(GradientDescent.GradientDescentMin(startPoint, func));
                extremumPoint.value = func(extremumPoint.X, extremumPoint.Y);

                return extremumPoint;

                break;
            case ExtremumType.Max:
                func = (x, y) => -WeightInPoint(new Point(x, y), layers);
                extremumPoint = new PointWithValue(GradientDescent.GradientDescentMin(startPoint, func));
                extremumPoint.value = -func(extremumPoint.X, extremumPoint.Y);


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


public static class OsmClient
{
    private static JsonSerializerOptions _options = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public static async Task<List<CityDto>> GetCitiesInArea(Area area)
    {
        var culture = new CultureInfo("en-US");
        culture.NumberFormat.NumberDecimalSeparator = ".";

        var url =
            $"https://overpass-api.de/api/interpreter?data=[out:json];(node[%22place%22=%22city%22]" +
            $"({area.LeftBottom.Y.ToString(culture)},{area.LeftBottom.X.ToString(culture)},{area.RightTop.Y.ToString(culture)},{area.RightTop.X.ToString(culture)});way[%22place%22=%22city%22]" +
            $"({area.LeftBottom.Y.ToString(culture)},{area.LeftBottom.X.ToString(culture)},{area.RightTop.Y.ToString(culture)},{area.RightTop.X.ToString(culture)}););out;";

        var json = await GetDataFromApi(url);
        var response = JsonSerializer.Deserialize<JsonElement>(json);
        var elements = response.GetProperty("elements");

        var cities = elements.EnumerateArray().Select(e =>
        {
            return new CityDto
            {
                Name = e.GetProperty("tags").GetProperty("name").GetString(),
                Lat = e.GetProperty("lat").GetDouble(),
                Lng = e.GetProperty("lon").GetDouble(),
                Population = int.Parse(e.GetProperty("tags").GetProperty("population").GetString()),
            };
        }).ToList();

        foreach (var city in cities)
        {
            await CheckAndSetRailway(city);
        }

        return cities;
    }

    private static async Task CheckAndSetRailway(CityDto city)
    {
        var culture = new CultureInfo("en-US");
        culture.NumberFormat.NumberDecimalSeparator = ".";
        var around = 10000;

        var url = $"https://overpass-api.de/api/interpreter?data=[out:json];" +
                  $"%20node[%22railway%22=%22station%22][%22subway%22!=%22yes%22]%20" +
                  $"(around:{around.ToString(culture)},{city.Lat.ToString(culture)},{city.Lng.ToString(culture)})%20;%20out%20count;";

        var json = await GetDataFromApi(url);
        var jsonObject = JsonSerializer.Deserialize<JsonElement>(json);

        var nodesValue = int.Parse(jsonObject.GetProperty("elements")
                                             .EnumerateArray()
                                             .First().GetProperty("tags")
                                             .GetProperty("nodes").GetString());

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
    public static PointWithValue GradientDescentMin(Point point,
                                                    Func<double, double, double> function)
    {
        var x = point.X;
        var y = point.Y;
        var learningRate = 0.1;

        // Количество итераций
        var numIterations = 100;

        // Градиентный спуск
        for (var i = 0; i < numIterations; i++)
        {
            // Вычисление приближенного градиента функции
            var gradientX = ApproximateGradientX(x, y, function);
            var gradientY = ApproximateGradientY(x, y, function);

            // Обновление переменных
            x = x - learningRate * gradientX;
            y = y - learningRate * gradientY;

            // Вывод текущих значений переменных и значения функции
            var functionValue = function(x, y);
        }

        var minPoint = new PointWithValue(x, y);
        minPoint.value = function(minPoint.X, minPoint.Y);

        return minPoint;
    }

    public static double ApproximateGradientX(double x, double y, Func<double, double, double> func)
    {
        var epsilon = 1e-6; // Малое число для вычисления приращения
        var f1 = func(x + epsilon, y);
        var f2 = func(x - epsilon, y);

        return (f1 - f2) / (2 * epsilon);
    }

    // Приближенное вычисление частной производной по y
    public static double ApproximateGradientY(double x, double y, Func<double, double, double> func)
    {
        var epsilon = 1e-6; // Малое число для вычисления приращения
        var f1 = func(x, y + epsilon);
        var f2 = func(x, y - epsilon);

        return (f1 - f2) / (2 * epsilon);
    }
}
