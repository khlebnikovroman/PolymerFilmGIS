namespace ObjectsParsers;

public static class ObjectParserFactory
{
    public static IObjectParser CreateParser(string fileName)
    {
        var extension = Path.GetExtension(fileName);

        switch (extension)
        {
            case ".csv":
                return new CsvObjectParser();

                break;
            default:
                throw new ArgumentException();
        }
    }
}
