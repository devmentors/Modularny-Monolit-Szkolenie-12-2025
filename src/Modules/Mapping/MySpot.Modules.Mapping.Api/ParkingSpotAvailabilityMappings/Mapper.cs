using MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Commands;
using MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Events;
using MySpot.Shared.Abstractions.Events;
using MySpot.Shared.Abstractions.Messaging;

namespace MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings;

internal sealed class Mapper : IEventHandler<ParkingSpotCreated>, IEventHandler<ParkingSpotDeleted>
{
    private readonly IMessageBroker _messageBroker;
    private readonly int ParkingSpotCapacity = 2;

    public Mapper(IMessageBroker messageBroker)
        => _messageBroker = messageBroker;

    public async Task HandleAsync(ParkingSpotCreated @event, CancellationToken cancellationToken = default)
    {
        var tags = new[] {"parking_spot"};
        await _messageBroker.PublishAsync(new AddResource(@event.ParkingSpotId, ParkingSpotCapacity, tags) , cancellationToken);
    }

    public async Task HandleAsync(ParkingSpotDeleted @event, CancellationToken cancellationToken = default)
    {
        await _messageBroker.PublishAsync(new DeleteResource(@event.ParkingSpotId) , cancellationToken);
    }
}