using Microsoft.EntityFrameworkCore;
using MySpot.Modules.ParkingSpots.Core.Clients;
using MySpot.Modules.ParkingSpots.Core.DAL;
using MySpot.Modules.ParkingSpots.Core.Entities;
using MySpot.Modules.ParkingSpots.Core.Events;
using MySpot.Modules.ParkingSpots.Core.Exceptions;
using MySpot.Shared.Abstractions.Messaging;

namespace MySpot.Modules.ParkingSpots.Core.Services;

internal sealed class ParkingSpotsService : IParkingSpotsService
{
    private const int ParkingSpotCapacity = 2;
    private readonly DbSet<ParkingSpot> _parkingSpots;
    private readonly ParkingSpotsDbContext _context;
    private readonly IMessageBroker _messageBroker;
    private readonly IAvailabilityApiClient _availabilityApiClient;

    public ParkingSpotsService(ParkingSpotsDbContext context, IMessageBroker messageBroker,
        IAvailabilityApiClient availabilityApiClient)
    {
        _context = context;
        _parkingSpots = context.ParkingSpots;
        _messageBroker = messageBroker;
        _availabilityApiClient = availabilityApiClient;
    }

    public async Task<IEnumerable<ParkingSpot>> GetAllAsync()
        => await _parkingSpots.OrderBy(x => x.DisplayOrder).ToListAsync();

    public async Task AddAsync(ParkingSpot parkingSpot)
    {
        await _parkingSpots.AddAsync(parkingSpot);
        await _context.SaveChangesAsync();
        // await _availabilityApiClient.AddResourceAsync(parkingSpot.Id, ParkingSpotCapacity, new[] {"parking_spot"});
        await _messageBroker.PublishAsync(new ParkingSpotCreated(parkingSpot.Id));
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
        await _messageBroker.PublishAsync(new ParkingSpotDeleted(parkingSpotId));
    }
}