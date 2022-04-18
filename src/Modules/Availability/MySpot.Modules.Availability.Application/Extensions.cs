using Microsoft.Extensions.DependencyInjection;
using MySpot.Modules.Availability.Application.Modules;
using MySpot.Modules.Availability.Shared;

namespace MySpot.Modules.Availability.Application;

public static class Extensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAvailabilityModuleApi, AvailabilityModuleApi>();

        return services;
    }
}
