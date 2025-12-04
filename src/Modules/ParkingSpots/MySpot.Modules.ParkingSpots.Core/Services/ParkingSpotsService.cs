using Microsoft.EntityFrameworkCore;
using MySpot.Modules.Availability.Shared;
using MySpot.Modules.Availability.Shared.DTO;
using MySpot.Modules.ParkingSpots.Core.DAL;
using MySpot.Modules.ParkingSpots.Core.Entities;
using MySpot.Modules.ParkingSpots.Core.Exceptions;
using MySpot.Shared.Abstractions.Messaging;

namespace MySpot.Modules.ParkingSpots.Core.Services;

internal sealed class ParkingSpotsService : IParkingSpotsService
{
    private const int ParkingSpotCapacity = 2;

    private readonly DbSet<ParkingSpot> _parkingSpots;
    private readonly ParkingSpotsDbContext _context;
    private readonly IMessageBroker _messageBroker;
    private readonly IAvailabilityModuleApi _availabilityModuleApi;

    public ParkingSpotsService(ParkingSpotsDbContext context, IMessageBroker messageBroker, IAvailabilityModuleApi availabilityModuleApi)
    {
        _context = context;
        _parkingSpots = context.ParkingSpots;
        _messageBroker = messageBroker;
        _availabilityModuleApi = availabilityModuleApi;
    }

    public async Task<IEnumerable<ParkingSpot>> GetAllAsync()
        => await _parkingSpots.OrderBy(x => x.DisplayOrder).ToListAsync();

    public async Task AddAsync(ParkingSpot parkingSpot)
    {
        await _parkingSpots.AddAsync(parkingSpot);
        await _context.SaveChangesAsync();
        await _availabilityModuleApi.AddResourceAsync(
            new AddResourceDto(parkingSpot.Id, ParkingSpotCapacity, new[] { "parking_spot" }));

        // TODO: Exercise #5 - Asynchronous Communication (Event-Driven)
        //
        // Replace synchronous module call with event publishing.
        // 1. Remove IModuleClient usage
        // 2. Use IMessageBroker.PublishAsync() to publish a ParkingSpotCreated event
        // 3. The event only needs the parking spot's ID
        //
        // Required using: MySpot.Modules.ParkingSpots.Core.Events
    }

    public async Task UpdateAsync(ParkingSpot parkingSpot)
    {
        var existingParkingSpot = await _parkingSpots.SingleOrDefaultAsync(x => x.Id == parkingSpot.Id);
        if (existingParkingSpot is null)
        {
            throw new ParkingSpotNotFoundException(parkingSpot.Id);
        }

        existingParkingSpot.Name = parkingSpot.Name;
        existingParkingSpot.DisplayOrder = parkingSpot.DisplayOrder;
        _parkingSpots.Update(parkingSpot);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Guid parkingSpotId)
    {
        var parkingSpot = await _parkingSpots.SingleOrDefaultAsync(x => x.Id == parkingSpotId);
        if (parkingSpot is null)
        {
            throw new ParkingSpotNotFoundException(parkingSpotId);
        }

        _parkingSpots.Remove(parkingSpot);
        await _context.SaveChangesAsync();

        // TODO: Exercise #5 - Asynchronous Communication
        //
        // Publish a ParkingSpotDeleted event when a parking spot is removed.
        // Use IMessageBroker.PublishAsync() with the parking spot's ID.
    }
}
