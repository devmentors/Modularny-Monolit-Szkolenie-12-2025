using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Moq;
using MySpot.Modules.ParkingSpots.Core.Clients;
using MySpot.Modules.ParkingSpots.Core.DAL;
using MySpot.Modules.ParkingSpots.Core.Entities;
using MySpot.Modules.ParkingSpots.Core.Services;
using MySpot.Shared.Abstractions.Messaging;
using MySpot.Shared.Abstractions.Modules;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MySpot.Workshops.Tests;

/// <summary>
/// Exercise 4: Local Contracts - HTTP-like Module Communication
///
/// These tests verify that:
/// 1. AvailabilityModule subscribes to module requests in the Use method
/// 2. AvailabilityApiClient implements AddResourceAsync using IModuleClient
/// 3. ParkingSpotsService uses IAvailabilityApiClient instead of IAvailabilityModuleApi
/// </summary>
public class Exercise04_LocalContractsTests
{
    private const string AvailabilityModuleTypeName = "MySpot.Modules.Availability.Api.AvailabilityModule";
    private const string ExpectedPath = "availability/resources/add";
    private const int ExpectedCapacity = 2;

    private static Assembly GetAvailabilityApiAssembly()
    {
        return Assembly.Load("MySpot.Modules.Availability.Api");
    }

    #region Part 1: AvailabilityModule Tests

    [Fact]
    public void AvailabilityModule_UseMethod_ShouldCallUseModuleRequests()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(AvailabilityModuleTypeName);
        Assert.NotNull(moduleType);

        var moduleInstance = Activator.CreateInstance(moduleType);
        var module = moduleInstance as IModule;
        Assert.NotNull(module);

        // Get the Use method body to check if it contains UseModuleRequests
        var useMethod = moduleType.GetMethod("Use");
        Assert.NotNull(useMethod);

        // Check the method body for the UseModuleRequests call
        var methodBody = useMethod.GetMethodBody();
        Assert.NotNull(methodBody);

        // If the method body has IL code (not empty), it should be using UseModuleRequests
        var ilBytes = methodBody.GetILAsByteArray();
        Assert.True(ilBytes != null && ilBytes.Length > 2,
            "The Use method should contain code that calls UseModuleRequests().Subscribe<AddResource>()");
    }

    [Fact]
    public void AvailabilityModule_UseMethod_ShouldNotBeEmpty()
    {
        // Arrange
        var assembly = GetAvailabilityApiAssembly();
        var moduleType = assembly.GetType(AvailabilityModuleTypeName);
        Assert.NotNull(moduleType);

        var useMethod = moduleType.GetMethod("Use");
        Assert.NotNull(useMethod);

        var methodBody = useMethod.GetMethodBody();
        Assert.NotNull(methodBody);

        // An empty method typically has just a 'ret' instruction (1 byte)
        // A method with actual code will have more bytes
        var ilBytes = methodBody.GetILAsByteArray();
        Assert.True(ilBytes != null && ilBytes.Length > 1,
            "The Use method should not be empty - it should subscribe to module requests for 'availability/resources/add'");
    }

    #endregion

    #region Part 2: AvailabilityApiClient Tests

    [Fact]
    public async Task AvailabilityApiClient_AddResourceAsync_ShouldCallModuleClientSendAsync()
    {
        // Arrange
        var resourceId = Guid.NewGuid();
        var capacity = 2;
        var tags = new[] { "parking_spot" };

        var moduleClientMock = new Mock<IModuleClient>();
        string? capturedPath = null;
        object? capturedRequest = null;

        moduleClientMock
            .Setup(x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<string, object, CancellationToken>((path, request, ct) =>
            {
                capturedPath = path;
                capturedRequest = request;
            })
            .Returns(Task.CompletedTask);

        var client = CreateAvailabilityApiClient(moduleClientMock.Object);
        Assert.NotNull(client);

        // Act
        await client.AddResourceAsync(resourceId, capacity, tags);

        // Assert
        moduleClientMock.Verify(
            x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()),
            Times.Once,
            "AvailabilityApiClient should call IModuleClient.SendAsync()");

        Assert.NotNull(capturedPath);
        Assert.Equal(ExpectedPath, capturedPath);
    }

    [Fact]
    public async Task AvailabilityApiClient_AddResourceAsync_ShouldSendCorrectResourceId()
    {
        // Arrange
        var resourceId = Guid.NewGuid();
        var capacity = 2;
        var tags = new[] { "parking_spot" };

        var moduleClientMock = new Mock<IModuleClient>();
        object? capturedRequest = null;

        moduleClientMock
            .Setup(x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<string, object, CancellationToken>((path, request, ct) => capturedRequest = request)
            .Returns(Task.CompletedTask);

        var client = CreateAvailabilityApiClient(moduleClientMock.Object);
        Assert.NotNull(client);

        // Act
        await client.AddResourceAsync(resourceId, capacity, tags);

        // Assert
        Assert.NotNull(capturedRequest);

        var resourceIdProperty = capturedRequest.GetType().GetProperty("ResourceId");
        Assert.NotNull(resourceIdProperty);

        var capturedResourceId = resourceIdProperty.GetValue(capturedRequest);
        Assert.Equal(resourceId, capturedResourceId);
    }

    [Fact]
    public async Task AvailabilityApiClient_AddResourceAsync_ShouldSendCorrectCapacity()
    {
        // Arrange
        var resourceId = Guid.NewGuid();
        var capacity = 5;
        var tags = new[] { "parking_spot" };

        var moduleClientMock = new Mock<IModuleClient>();
        object? capturedRequest = null;

        moduleClientMock
            .Setup(x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<string, object, CancellationToken>((path, request, ct) => capturedRequest = request)
            .Returns(Task.CompletedTask);

        var client = CreateAvailabilityApiClient(moduleClientMock.Object);
        Assert.NotNull(client);

        // Act
        await client.AddResourceAsync(resourceId, capacity, tags);

        // Assert
        Assert.NotNull(capturedRequest);

        var capacityProperty = capturedRequest.GetType().GetProperty("Capacity");
        Assert.NotNull(capacityProperty);

        var capturedCapacity = capacityProperty.GetValue(capturedRequest);
        Assert.Equal(capacity, capturedCapacity);
    }

    [Fact]
    public async Task AvailabilityApiClient_AddResourceAsync_ShouldSendCorrectTags()
    {
        // Arrange
        var resourceId = Guid.NewGuid();
        var capacity = 2;
        var tags = new[] { "parking_spot", "vip" };

        var moduleClientMock = new Mock<IModuleClient>();
        object? capturedRequest = null;

        moduleClientMock
            .Setup(x => x.SendAsync(It.IsAny<string>(), It.IsAny<object>(), It.IsAny<CancellationToken>()))
            .Callback<string, object, CancellationToken>((path, request, ct) => capturedRequest = request)
            .Returns(Task.CompletedTask);

        var client = CreateAvailabilityApiClient(moduleClientMock.Object);
        Assert.NotNull(client);

        // Act
        await client.AddResourceAsync(resourceId, capacity, tags);

        // Assert
        Assert.NotNull(capturedRequest);

        var tagsProperty = capturedRequest.GetType().GetProperty("Tags");
        Assert.NotNull(tagsProperty);

        var capturedTags = tagsProperty.GetValue(capturedRequest) as IEnumerable<string>;
        Assert.NotNull(capturedTags);
        Assert.Contains("parking_spot", capturedTags);
        Assert.Contains("vip", capturedTags);
    }

    #endregion

    #region Part 3: ParkingSpotsService Tests

    [Fact]
    public void ParkingSpotsService_Constructor_ShouldAcceptIAvailabilityApiClient()
    {
        // Arrange
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        // Act & Assert
        var hasAvailabilityApiClientConstructor = constructors.Any(c =>
            c.GetParameters().Any(p => p.ParameterType == typeof(IAvailabilityApiClient)));

        Assert.True(hasAvailabilityApiClientConstructor,
            "ParkingSpotsService should have a constructor that accepts IAvailabilityApiClient");
    }

    [Fact]
    public void ParkingSpotsService_Constructor_ShouldNotAcceptIAvailabilityModuleApi()
    {
        // Arrange
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        var availabilityModuleApiType = Type.GetType(
            "MySpot.Modules.Availability.Shared.IAvailabilityModuleApi, MySpot.Modules.Availability.Shared");

        // Act & Assert
        if (availabilityModuleApiType != null)
        {
            var hasAvailabilityModuleApiConstructor = constructors.Any(c =>
                c.GetParameters().Any(p => p.ParameterType == availabilityModuleApiType));

            Assert.False(hasAvailabilityModuleApiConstructor,
                "ParkingSpotsService should NOT have a constructor that accepts IAvailabilityModuleApi - use IAvailabilityApiClient instead");
        }
    }

    [Fact]
    public async Task ParkingSpotsService_AddAsync_ShouldCallAvailabilityApiClient()
    {
        // Arrange
        var parkingSpotId = Guid.NewGuid();
        var parkingSpot = new ParkingSpot
        {
            Id = parkingSpotId,
            Name = "Spot A1",
            DisplayOrder = 1
        };

        var options = new DbContextOptionsBuilder<ParkingSpotsDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        using var context = new ParkingSpotsDbContext(options);

        var messageBrokerMock = new Mock<IMessageBroker>();
        var availabilityApiClientMock = new Mock<IAvailabilityApiClient>();

        Guid? capturedResourceId = null;
        int? capturedCapacity = null;
        IEnumerable<string>? capturedTags = null;

        availabilityApiClientMock
            .Setup(x => x.AddResourceAsync(It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<IEnumerable<string>>()))
            .Callback<Guid, int, IEnumerable<string>>((resourceId, capacity, tags) =>
            {
                capturedResourceId = resourceId;
                capturedCapacity = capacity;
                capturedTags = tags;
            })
            .Returns(Task.CompletedTask);

        var service = CreateParkingSpotsServiceWithAvailabilityApiClient(
            context, messageBrokerMock.Object, availabilityApiClientMock.Object);

        if (service == null)
        {
            Assert.Fail("ParkingSpotsService should have a constructor that accepts IAvailabilityApiClient");
            return;
        }

        // Act
        await service.AddAsync(parkingSpot);

        // Assert
        availabilityApiClientMock.Verify(
            x => x.AddResourceAsync(It.IsAny<Guid>(), It.IsAny<int>(), It.IsAny<IEnumerable<string>>()),
            Times.Once,
            "ParkingSpotsService should call IAvailabilityApiClient.AddResourceAsync() when adding a parking spot");

        Assert.Equal(parkingSpotId, capturedResourceId);
        Assert.Equal(ExpectedCapacity, capturedCapacity);
        Assert.NotNull(capturedTags);
        Assert.Contains("parking_spot", capturedTags);
    }

    #endregion

    #region Helper Methods

    private static IAvailabilityApiClient CreateAvailabilityApiClient(IModuleClient moduleClient)
    {
        var assembly = Assembly.Load("MySpot.Modules.ParkingSpots.Core");
        var clientType = assembly.GetType("MySpot.Modules.ParkingSpots.Core.Clients.AvailabilityApiClient");

        Assert.NotNull(clientType);

        var constructor = clientType.GetConstructors(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance)
            .FirstOrDefault();

        Assert.NotNull(constructor);

        var parameters = constructor.GetParameters();
        var args = new object?[parameters.Length];

        for (int i = 0; i < parameters.Length; i++)
        {
            var paramType = parameters[i].ParameterType;
            if (paramType == typeof(IModuleClient))
                args[i] = moduleClient;
            else if (paramType.Name.Contains("ILogger"))
                args[i] = CreateNullLogger(paramType);
        }

        return (IAvailabilityApiClient)constructor.Invoke(args);
    }

    private static object CreateNullLogger(Type loggerType)
    {
        var nullLoggerType = typeof(Microsoft.Extensions.Logging.Abstractions.NullLogger<>);
        var genericType = loggerType.GetGenericArguments()[0];
        var constructedType = nullLoggerType.MakeGenericType(genericType);
        return Activator.CreateInstance(constructedType)!;
    }

    private static IParkingSpotsService? CreateParkingSpotsServiceWithAvailabilityApiClient(
        ParkingSpotsDbContext context,
        IMessageBroker messageBroker,
        IAvailabilityApiClient availabilityApiClient)
    {
        var constructors = typeof(ParkingSpotsService).GetConstructors(
            BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance);

        // Find constructor with IAvailabilityApiClient
        var constructor = constructors.FirstOrDefault(c =>
            c.GetParameters().Any(p => p.ParameterType == typeof(IAvailabilityApiClient)));

        if (constructor == null)
        {
            return null;
        }

        // Build parameters based on constructor signature
        var parameters = constructor.GetParameters();
        var args = new object?[parameters.Length];

        for (int i = 0; i < parameters.Length; i++)
        {
            var paramType = parameters[i].ParameterType;
            if (paramType == typeof(ParkingSpotsDbContext))
                args[i] = context;
            else if (paramType == typeof(IMessageBroker))
                args[i] = messageBroker;
            else if (paramType == typeof(IAvailabilityApiClient))
                args[i] = availabilityApiClient;
        }

        return constructor.Invoke(args) as IParkingSpotsService;
    }

    #endregion
}
