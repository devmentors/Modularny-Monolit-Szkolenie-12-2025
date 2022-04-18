using MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Commands;
using MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings.Events;
using MySpot.Shared.Abstractions.Events;
using MySpot.Shared.Abstractions.Messaging;

namespace MySpot.Modules.Mapping.Api.ParkingSpotAvailabilityMappings;

// TODO: Exercise #5 - Implement the Mapper class for asynchronous event-driven communication
//
// This class acts as a translation layer (Anti-Corruption Layer) between ParkingSpots and Availability modules.
// Instead of ParkingSpots directly calling Availability (tight coupling), we use events.
//
// Flow: ParkingSpots -> publishes event -> Mapper handles it -> publishes command -> Availability
//
// Requirements:
// 1. Create a class that implements IEventHandler<ParkingSpotCreated> and IEventHandler<ParkingSpotDeleted>
// 2. Inject IMessageBroker via constructor
// 3. In HandleAsync(ParkingSpotCreated):
//    - Create and publish an AddResource command for the Availability module
//    - Check the AddResource record to see what parameters it needs
// 4. In HandleAsync(ParkingSpotDeleted):
//    - Create and publish a DeleteResource command for the Availability module
//
// Hint: Look at the Commands folder to see what AddResource and DeleteResource require

