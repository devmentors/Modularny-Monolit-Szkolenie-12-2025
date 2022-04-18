using System.Threading.Tasks;
using MySpot.Modules.Availability.Application.Commands;
using MySpot.Modules.Availability.Shared;
using MySpot.Modules.Availability.Shared.DTO;
using MySpot.Shared.Abstractions.Dispatchers;

namespace MySpot.Modules.Availability.Application.Modules;

internal sealed class AvailabilityModuleApi : IAvailabilityModuleApi
{
    private readonly IDispatcher _dispatcher;

    public AvailabilityModuleApi(IDispatcher dispatcher)
    {
        _dispatcher = dispatcher;
    }

    public async Task AddResourceAsync(AddResourceDto dto)
    {
        await _dispatcher.SendAsync(new AddResource(dto.ResourceId, dto.Capacity, dto.Tags));
    }
}
