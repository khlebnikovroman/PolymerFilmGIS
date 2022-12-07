using DAL;

using Microsoft.AspNetCore.Authorization;

using WebAppWithReact.Extensions;


namespace WebAppWithReact.Misc.AuthHandlers;

public class OwnByUserHandler : AuthorizationHandler<OwnByUserRequirement, IOwnByUser>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, OwnByUserRequirement requirement, IOwnByUser resource)
    {
        if (resource.AppUserId == context.User.GetLoggedInUserId<Guid>())
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}


public class OwnByUserRequirement : IAuthorizationRequirement
{
}
