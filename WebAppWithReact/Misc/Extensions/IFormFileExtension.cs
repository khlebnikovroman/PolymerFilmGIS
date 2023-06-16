namespace ObjectsParsers;

public static class FormFileExtension
{
    public static async Task<string> SaveTo(this IFormFile file, string directory)
    {
        if (file.Length > 0)
        {
            if (!Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            var filePath = Path.Combine(directory, file.FileName);

            using (Stream fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);

                return filePath;
            }
        }

        throw new ArgumentException();
    }
}
