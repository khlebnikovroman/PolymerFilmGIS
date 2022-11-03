using System.Net;
using System.Text.Json;

using WebAppWithReact.Misc.Exceptions;


namespace WebAppWithReact.Misc.Middleware;

public class ErrorHandlingMiddleware
{
    private readonly ILogger<ErrorHandlingMiddleware> _logger;
    private readonly RequestDelegate _next;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex, _logger);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex, ILogger<ErrorHandlingMiddleware> logger)
    {
        object errors = null;

        switch (ex)
        {
            case RestException rest:
                logger.LogError(ex, "Rest error");
                errors = rest.Errors;
                context.Response.StatusCode = (int) rest.Code;

                break;

            // ReSharper disable once PatternAlwaysOfType
            case Exception e:
                logger.LogError(ex, "Server error");
                errors = string.IsNullOrWhiteSpace(e.Message) ? "error" : e.Message;
                context.Response.StatusCode = (int) HttpStatusCode.InternalServerError;

                break;
        }

        context.Response.ContentType = "appliation/json";

        if (errors != null)
        {
            var result = JsonSerializer.Serialize(new
            {
                errors,
            });

            await context.Response.WriteAsync(result);
        }
    }
}
