using Microsoft.Extensions.Logging;
using MySpot.Modules.ParkingSpots.Core.Exceptions;
using MySpot.Shared.Abstractions.Modules;

namespace MySpot.Modules.ParkingSpots.Core.Clients;

// TODO: Exercise #4 - Local Contracts - Implement the API Client
//
// This client uses IModuleClient to communicate with Availability module.
// It's a local contract - looser coupling than shared contracts (IAvailabilityModuleApi).
//
// Requirements for AddResourceAsync:
// 1. Use _moduleClient.SendAsync() to send request to path "availability/resources/add"
// 2. Pass an anonymous object with resourceId, capacity, tags properties
// 3. Wrap in try-catch and throw CannotAddResourceException on failure
// 4. Log the error using _logger before throwing
//
// Hint: Check IModuleClient interface to see SendAsync signature

internal sealed class AvailabilityApiClient : IAvailabilityApiClient
{
    private readonly IModuleClient _moduleClient;
    private readonly ILogger<AvailabilityApiClient> _logger;

    public AvailabilityApiClient(IModuleClient moduleClient, ILogger<AvailabilityApiClient> logger)
    {
        _moduleClient = moduleClient;
        _logger = logger;
    }

    public async Task AddResourceAsync(Guid resourceId, int capacity, IEnumerable<string> tags)
    {
        try
        {
            await _moduleClient.SendAsync("availability/resources/add", new
            {
                ResourceId = resourceId,
                Capacity = capacity,
                Tags = tags
            });
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "Failed to add resource: {ResourceId}", resourceId);
            throw new CannotAddResourceException(resourceId);
        }
    }
}
