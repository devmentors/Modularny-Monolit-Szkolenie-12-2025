using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySpot.Modules.Availability.Application;
using MySpot.Modules.Availability.Application.Commands;
using MySpot.Modules.Availability.Infrastructure;
using MySpot.Shared.Abstractions.Dispatchers;
using MySpot.Shared.Abstractions.Modules;
using MySpot.Shared.Infrastructure.Modules;

namespace MySpot.Modules.Availability.Api;


internal sealed class AvailabilityModule : IModule
{
    public string Name { get; } = "Availability";

    public void Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddApplication().AddInfrastructure(configuration);
    }

    public void Use(IApplicationBuilder app)
    {
        app.UseModuleRequests()
            .Subscribe<AddResource>("availability/resources/add", (command, serviceProvider, ct) =>
                serviceProvider.GetRequiredService<IDispatcher>().SendAsync(command, ct));
    }

    public void Expose(IEndpointRouteBuilder endpoints)
    {
    }
}
// TODO: Exercise #4 - Local Contracts - Subscribe to module requests
//
// After completing Exercise #2, update the Use() method to:
// 1. Subscribe to module requests using app.UseModuleRequests()
// 2. Register a handler for path "availability/resources/add"
// 3. The handler should dispatch the AddResource command via IDispatcher
//
// Required usings for Exercise #4:
// - MySpot.Modules.Availability.Application.Commands
// - MySpot.Shared.Abstractions.Dispatchers
// - MySpot.Shared.Infrastructure.Modules
