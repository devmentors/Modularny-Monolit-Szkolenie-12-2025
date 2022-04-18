using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySpot.Modules.Availability.Application;
using MySpot.Modules.Availability.Infrastructure;
using MySpot.Shared.Abstractions.Modules;

namespace MySpot.Modules.Availability.Api;

// TODO: Exercise #2 - Implement the IModule interface for the Availability module
//
// Requirements:
// 1. Create a class named AvailabilityModule that implements IModule
// 2. Set Name property to return "Availability"
// 3. In Register() method, add Application and Infrastructure services using extension methods
// 4. Use() and Expose() methods can have empty bodies for now
//
// Hint: Look at how other modules implement IModule (e.g., ParkingSpotsModule, UsersModule)

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
