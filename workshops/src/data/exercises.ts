import type { Exercise } from '../types/Exercise';

export const exercises: Exercise[] = [
  {
    id: 'exercise-01',
    sequenceNumber: 1,
    title: 'Module Design',
    titlePl: 'Projektowanie Modułów',
    category: 'Application Design',
    categoryPl: 'Projektowanie Aplikacji',
    timeMinutes: 30,
    description: `
# Module Design

Before writing any code, let's design our modules! In this exercise, you'll work with your team to identify and design the modules for our parking spot reservation system.

## Your Task

Using the Miro board, design the modules for the application using **any approach you prefer**:

- Draw boxes for each module you identify
- Think about what functionality belongs together
- Consider how modules might need to communicate
- Don't worry about getting it "perfect" - this is exploratory!

## Things to Consider

- What are the main features of a parking spot reservation system?
- What data belongs together?
- What operations are related?
- Where are the natural boundaries?

## After the Exercise

We'll compare your design with the actual module structure in the codebase and discuss the trade-offs of different approaches.

> **Note:** This is a collaborative exercise - no code changes required! Click "Mark as Complete" when you're done.
    `,
    descriptionPl: `
# Projektowanie Modułów

Zanim napiszemy jakikolwiek kod, zaprojektujmy nasze moduły! W tym ćwiczeniu będziesz pracować z zespołem nad identyfikacją i projektowaniem modułów dla naszego systemu rezerwacji miejsc parkingowych.

## Twoje zadanie

Używając tablicy Miro, zaprojektuj moduły aplikacji używając **dowolnego podejścia**:

- Narysuj prostokąty dla każdego zidentyfikowanego modułu
- Zastanów się, jaka funkcjonalność powinna być razem
- Rozważ jak moduły mogą potrzebować się komunikować
- Nie martw się o "perfekcję" - to jest eksploracja!

## Rzeczy do rozważenia

- Jakie są główne funkcje systemu rezerwacji miejsc parkingowych?
- Jakie dane należą do siebie?
- Jakie operacje są powiązane?
- Gdzie są naturalne granice?

## Po ćwiczeniu

Porównamy Twój projekt z rzeczywistą strukturą modułów w kodzie i omówimy kompromisy różnych podejść.

> **Uwaga:** To jest ćwiczenie zespołowe - nie wymaga zmian w kodzie! Kliknij "Oznacz jako ukończone" gdy skończysz.
    `,
    externalLink: 'https://miro.com/app/board/uXjVJheykuQ=/',
    externalLinkLabel: 'Open Miro Board',
    externalLinkLabelPl: 'Otwórz tablicę Miro',
    relatedFiles: []
  },
  {
    id: 'exercise-02',
    sequenceNumber: 2,
    title: 'Module Loading - Creating a Module',
    titlePl: 'Ładowanie Modułów - Tworzenie Modułu',
    category: 'Module Architecture',
    categoryPl: 'Architektura Modułów',
    timeMinutes: 10,
    description: `
# Module Loading in Modular Monolith

In a modular monolith, each module is a self-contained unit that gets loaded at application startup. The \`IModule\` interface defines the contract that every module must implement.

## How Modules Are Loaded

1. **Assembly Scanning**: At startup, \`ModuleLoader.LoadAssemblies()\` scans for DLLs matching the pattern \`MySpot.Modules.*\`
2. **Module Discovery**: \`ModuleLoader.LoadModules()\` finds all classes implementing \`IModule\`
3. **Registration**: Each module's \`Register()\` method is called to add services to DI container
4. **Configuration**: Each module's \`Use()\` method is called to configure middleware
5. **Endpoints**: Each module's \`Expose()\` method is called to register HTTP endpoints

## The IModule Interface

\`\`\`csharp
public interface IModule
{
    string Name { get; }
    IEnumerable<string> Policies => null;
    void Register(IServiceCollection services, IConfiguration configuration);
    void Use(IApplicationBuilder app);
    void Expose(IEndpointRouteBuilder endpoints);
}
\`\`\`

## Your Task

The \`AvailabilityModule\` class has been removed and the module is currently disabled. Your task is to implement it and enable it.

### Step 1: Create the AvailabilityModule class

1. Create a class \`AvailabilityModule\` that implements \`IModule\`
2. Set \`Name\` to \`"Availability"\`
3. In \`Register()\`, call the extension methods to add Application and Infrastructure services:
   \`\`\`csharp
   services.AddApplication().AddInfrastructure(configuration);
   \`\`\`
4. \`Use()\` and \`Expose()\` can have empty bodies for now

### Step 2: Enable the module

In \`module.availability.json\`, change \`enabled\` to \`true\`:
\`\`\`json
{
  "availability": {
    "module": {
      "name": "Availability",
      "enabled": true
    }
  }
}
\`\`\`

## Verification

After implementing the module, check the \`/modules\` endpoint - "Availability" should appear in the list of loaded modules.

## Files to Modify

- \`src/Modules/Availability/MySpot.Modules.Availability.Api/AvailabilityModule.cs\`
- \`src/Modules/Availability/MySpot.Modules.Availability.Api/module.availability.json\`
    `,
    descriptionPl: `
# Ładowanie modułów w Modularnym Monolicie

W modularnym monolicie każdy moduł jest samodzielną jednostką, która jest ładowana podczas uruchamiania aplikacji. Interfejs \`IModule\` definiuje kontrakt, który musi implementować każdy moduł.

## Jak ładowane są moduły

1. **Skanowanie assembly**: Podczas uruchamiania \`ModuleLoader.LoadAssemblies()\` skanuje DLL pasujące do wzorca \`MySpot.Modules.*\`
2. **Odkrywanie modułów**: \`ModuleLoader.LoadModules()\` znajduje wszystkie klasy implementujące \`IModule\`
3. **Rejestracja**: Metoda \`Register()\` każdego modułu jest wywoływana, aby dodać usługi do kontenera DI
4. **Konfiguracja**: Metoda \`Use()\` każdego modułu jest wywoływana, aby skonfigurować middleware
5. **Endpointy**: Metoda \`Expose()\` każdego modułu jest wywoływana, aby zarejestrować endpointy HTTP

## Interfejs IModule

\`\`\`csharp
public interface IModule
{
    string Name { get; }
    IEnumerable<string> Policies => null;
    void Register(IServiceCollection services, IConfiguration configuration);
    void Use(IApplicationBuilder app);
    void Expose(IEndpointRouteBuilder endpoints);
}
\`\`\`

## Twoje zadanie

Klasa \`AvailabilityModule\` została usunięta, a moduł jest obecnie wyłączony. Twoim zadaniem jest jej implementacja i włączenie modułu.

### Krok 1: Utwórz klasę AvailabilityModule

1. Utwórz klasę \`AvailabilityModule\` implementującą \`IModule\`
2. Ustaw \`Name\` na \`"Availability"\`
3. W \`Register()\` wywołaj metody rozszerzające, aby dodać serwisy Application i Infrastructure:
   \`\`\`csharp
   services.AddApplication().AddInfrastructure(configuration);
   \`\`\`
4. \`Use()\` i \`Expose()\` mogą mieć puste ciała na razie

### Krok 2: Włącz moduł

W \`module.availability.json\` zmień \`enabled\` na \`true\`:
\`\`\`json
{
  "availability": {
    "module": {
      "name": "Availability",
      "enabled": true
    }
  }
}
\`\`\`

## Weryfikacja

Po zaimplementowaniu modułu sprawdź endpoint \`/modules\` - "Availability" powinno pojawić się na liście załadowanych modułów.

## Pliki do modyfikacji

- \`src/Modules/Availability/MySpot.Modules.Availability.Api/AvailabilityModule.cs\`
- \`src/Modules/Availability/MySpot.Modules.Availability.Api/module.availability.json\`
    `,
    hint: 'Look at how other modules like UsersModule or ParkingSpotsModule implement the IModule interface. The class should be internal sealed and have a Name property that returns "Availability".',
    hintPl: 'Sprawdź jak inne moduły, takie jak UsersModule lub ParkingSpotsModule, implementują interfejs IModule. Klasa powinna być internal sealed i mieć właściwość Name zwracającą "Availability".',
    solution: `
internal sealed class AvailabilityModule : IModule
{
    public string Name { get; } = "Availability";

    public void Register(IServiceCollection services, IConfiguration configuration)
    {
        services.AddApplication().AddInfrastructure(configuration);
    }

    public void Use(IApplicationBuilder app)
    {
    }

    public void Expose(IEndpointRouteBuilder endpoints)
    {
    }
}
    `.trim(),
    solutionExplanation: `
The solution demonstrates the basic module structure in a modular monolith:

1. **IModule Implementation**: The class implements \`IModule\` to be discovered by the module loader
2. **Name Property**: Returns a unique identifier for the module ("Availability")
3. **Register Method**: Adds services to the DI container using extension methods:
   - \`AddApplication()\` - registers application layer services (handlers, validators)
   - \`AddInfrastructure(configuration)\` - registers infrastructure services (repositories, DbContext)
4. **Use/Expose Methods**: Empty for now, but can be used later for:
   - \`Use()\` - configure middleware, subscribe to module requests
   - \`Expose()\` - register HTTP endpoints

The \`internal sealed\` modifier ensures the module class is only accessible within its assembly and cannot be inherited.
    `.trim(),
    solutionExplanationPl: `
Rozwiązanie demonstruje podstawową strukturę modułu w modularnym monolicie:

1. **Implementacja IModule**: Klasa implementuje \`IModule\`, aby być odkrytą przez loader modułów
2. **Właściwość Name**: Zwraca unikalny identyfikator modułu ("Availability")
3. **Metoda Register**: Dodaje serwisy do kontenera DI używając metod rozszerzających:
   - \`AddApplication()\` - rejestruje serwisy warstwy aplikacji (handlery, walidatory)
   - \`AddInfrastructure(configuration)\` - rejestruje serwisy infrastruktury (repozytoria, DbContext)
4. **Metody Use/Expose**: Puste na razie, ale mogą być użyte później do:
   - \`Use()\` - konfiguracja middleware, subskrypcja żądań modułowych
   - \`Expose()\` - rejestracja endpointów HTTP

Modyfikator \`internal sealed\` zapewnia, że klasa modułu jest dostępna tylko w swoim assembly i nie może być dziedziczona.
    `.trim(),
    testFilter: 'FullyQualifiedName~Exercise02',
    relatedFiles: [
      'src/Modules/Availability/MySpot.Modules.Availability.Api/AvailabilityModule.cs',
      'src/Modules/Availability/MySpot.Modules.Availability.Api/module.availability.json',
      'src/Shared/MySpot.Shared.Abstractions/Modules/IModule.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Modules/ModuleLoader.cs',
      'src/Bootstrapper/MySpot.Bootstrapper/Program.cs'
    ]
  },
  {
    id: 'exercise-03',
    sequenceNumber: 3,
    title: 'Shared Contracts - Synchronous Module Communication',
    titlePl: 'Shared Contracts - Synchroniczna Komunikacja Modułów',
    category: 'Synchronous Communication',
    categoryPl: 'Komunikacja Synchroniczna',
    timeMinutes: 15,
    description: `
# Shared Contracts Pattern

In a modular monolith, modules need to communicate with each other. One approach is **Shared Contracts** - where a module exposes a public API through a shared project.

## Scenario

The \`ParkingSpots\` module needs to notify the \`Availability\` module when a new parking spot is created. This way, the Availability module can track it as a resource.

## What's Already Done

1. A new project \`MySpot.Modules.Availability.Shared\` has been created with:
   - \`IAvailabilityModuleApi\` - the public interface
   - \`AddResourceDto\` - the data transfer object

2. The \`AvailabilityModuleApi\` implementation exists in \`Availability.Application\` (internal)

3. The \`ParkingSpotsService\` has been updated to inject \`IAvailabilityModuleApi\`

## Your Task

In \`ParkingSpotsService.AddAsync()\`, call the Availability module API to add a resource.

Find the \`TODO\` comment and replace it with:
\`\`\`csharp
await _availabilityModuleApi.AddResourceAsync(
    new AddResourceDto(parkingSpot.Id, ParkingSpotCapacity, new[] { "parking_spot" }));
\`\`\`

## Files to Modify

- \`src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs\`
    `,
    descriptionPl: `
# Wzorzec Shared Contracts

W modularnym monolicie moduły muszą się ze sobą komunikować. Jednym z podejść jest **Shared Contracts** - gdzie moduł udostępnia publiczne API poprzez współdzielony projekt.

## Scenariusz

Moduł \`ParkingSpots\` musi powiadomić moduł \`Availability\`, gdy zostanie utworzone nowe miejsce parkingowe. W ten sposób moduł Availability może śledzić je jako zasób.

## Co już zostało zrobione

1. Utworzono nowy projekt \`MySpot.Modules.Availability.Shared\` zawierający:
   - \`IAvailabilityModuleApi\` - publiczny interfejs
   - \`AddResourceDto\` - obiekt transferu danych

2. Implementacja \`AvailabilityModuleApi\` istnieje w \`Availability.Application\` (wewnętrzna)

3. \`ParkingSpotsService\` został zaktualizowany, aby wstrzykiwać \`IAvailabilityModuleApi\`

## Twoje zadanie

W metodzie \`ParkingSpotsService.AddAsync()\` wywołaj API modułu Availability, aby dodać zasób.

Znajdź komentarz \`TODO\` i zastąp go:
\`\`\`csharp
await _availabilityModuleApi.AddResourceAsync(
    new AddResourceDto(parkingSpot.Id, ParkingSpotCapacity, new[] { "parking_spot" }));
\`\`\`

## Pliki do modyfikacji

- \`src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs\`
    `,
    hint: 'Look for the TODO comment in the AddAsync method. You need to create a new AddResourceDto with the parking spot ID, capacity (use the ParkingSpotCapacity constant), and tags array.',
    hintPl: 'Poszukaj komentarza TODO w metodzie AddAsync. Musisz utworzyć nowy AddResourceDto z ID miejsca parkingowego, pojemnością (użyj stałej ParkingSpotCapacity) i tablicą tagów.',
    solution: `
await _availabilityModuleApi.AddResourceAsync(
    new AddResourceDto(parkingSpot.Id, ParkingSpotCapacity, new[] { "parking_spot" }));
    `.trim(),
    solutionExplanation: `
The solution demonstrates the Shared Contracts pattern:

1. **Shared Project**: \`Availability.Shared\` contains the interface and DTO that other modules can reference
2. **Internal Implementation**: \`AvailabilityModuleApi\` is internal to the Availability module - other modules only see the interface
3. **Loose Coupling**: ParkingSpots only depends on the Shared project, not the full Availability module
4. **Synchronous Call**: This is a direct method call - the request is processed immediately

Benefits:
- Type-safe contracts between modules
- Clear API boundaries
- Easy to test with mocks
- Compile-time checks for contract changes
    `.trim(),
    solutionExplanationPl: `
Rozwiązanie demonstruje wzorzec Shared Contracts:

1. **Współdzielony projekt**: \`Availability.Shared\` zawiera interfejs i DTO, do których mogą się odwoływać inne moduły
2. **Wewnętrzna implementacja**: \`AvailabilityModuleApi\` jest wewnętrzny dla modułu Availability - inne moduły widzą tylko interfejs
3. **Luźne powiązanie**: ParkingSpots zależy tylko od projektu Shared, nie od pełnego modułu Availability
4. **Wywołanie synchroniczne**: To bezpośrednie wywołanie metody - żądanie jest przetwarzane natychmiast

Korzyści:
- Bezpieczne typowo kontrakty między modułami
- Jasne granice API
- Łatwe testowanie z mockami
- Sprawdzanie kontraktów w czasie kompilacji
    `.trim(),
    testFilter: 'FullyQualifiedName~Exercise03',
    relatedFiles: [
      'src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs',
      'src/Modules/Availability/MySpot.Modules.Availability.Shared/IAvailabilityModuleApi.cs',
      'src/Modules/Availability/MySpot.Modules.Availability.Shared/DTO/AddResourceDto.cs',
      'src/Modules/Availability/MySpot.Modules.Availability.Application/Modules/AvailabilityModuleApi.cs'
    ]
  },
  {
    id: 'exercise-04',
    sequenceNumber: 4,
    title: 'Local Contracts - HTTP-like Module Communication',
    titlePl: 'Local Contracts - Komunikacja HTTP-podobna',
    category: 'Synchronous Communication',
    categoryPl: 'Komunikacja Synchroniczna',
    timeMinutes: 20,
    description: `
# Local Contracts Pattern

In Exercise #3, we used **Shared Contracts** where modules share interfaces and DTOs. While this works, it creates compile-time dependencies between modules.

**Local Contracts** is an alternative approach that mimics HTTP communication - each module defines its own contracts internally, and communication happens through serialization/deserialization.

## How It Works

1. **Sender** creates a request object and sends it to a path (like an HTTP endpoint)
2. The infrastructure **serializes** the request to JSON
3. **Receiver** module has subscribed to that path with its own request type
4. The infrastructure **deserializes** to the receiver's type and invokes the handler

This is similar to how microservices communicate via HTTP, but without network overhead!

## Your Task (Two Parts)

### Part 1: Subscribe to requests in AvailabilityModule

In \`AvailabilityModule.Use()\`, subscribe to module requests:

\`\`\`csharp
app.UseModuleRequests()
    .Subscribe<AddResource>("availability/resources/add", (command, serviceProvider, ct) =>
        serviceProvider.GetRequiredService<IDispatcher>().SendAsync(command, ct));
\`\`\`

**Required usings:**
\`\`\`csharp
using MySpot.Modules.Availability.Application.Commands;
using MySpot.Shared.Abstractions.Dispatchers;
using MySpot.Shared.Infrastructure.Modules;
\`\`\`

### Part 2: Implement AvailabilityApiClient

The \`AvailabilityApiClient\` class wraps \`IModuleClient\` and provides a typed interface. Find the TODO and implement \`AddResourceAsync\`:

\`\`\`csharp
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
\`\`\`

### Part 3: Replace Shared Contract with Local Contract in ParkingSpotsService

1. Replace \`IAvailabilityModuleApi\` with \`IAvailabilityApiClient\` in constructor
2. Remove the Shared contract using and DTO
3. Replace the call with:

\`\`\`csharp
await _availabilityApiClient.AddResourceAsync(parkingSpot.Id, ParkingSpotCapacity, new[] { "parking_spot" });
\`\`\`

## Files to Modify

- \`src/Modules/Availability/MySpot.Modules.Availability.Api/AvailabilityModule.cs\`
- \`src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Clients/AvailabilityApiClient.cs\`
- \`src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs\`
    `,
    descriptionPl: `
# Wzorzec Local Contracts

W ćwiczeniu #3 użyliśmy **Shared Contracts**, gdzie moduły dzielą interfejsy i DTO. Choć to działa, tworzy zależności w czasie kompilacji między modułami.

**Local Contracts** to alternatywne podejście, które naśladuje komunikację HTTP - każdy moduł definiuje swoje kontrakty wewnętrznie, a komunikacja odbywa się poprzez serializację/deserializację.

## Jak to działa

1. **Nadawca** tworzy obiekt żądania i wysyła go na ścieżkę (jak endpoint HTTP)
2. Infrastruktura **serializuje** żądanie do JSON
3. Moduł **odbiorcy** subskrybował tę ścieżkę ze swoim własnym typem żądania
4. Infrastruktura **deserializuje** do typu odbiorcy i wywołuje handler

To podobne do komunikacji mikroserwisów przez HTTP, ale bez narzutu sieciowego!

## Twoje zadanie (dwie części)

### Część 1: Subskrybuj żądania w AvailabilityModule

W \`AvailabilityModule.Use()\` subskrybuj żądania modułowe:

\`\`\`csharp
app.UseModuleRequests()
    .Subscribe<AddResource>("availability/resources/add", (command, serviceProvider, ct) =>
        serviceProvider.GetRequiredService<IDispatcher>().SendAsync(command, ct));
\`\`\`

**Wymagane usingi:**
\`\`\`csharp
using MySpot.Modules.Availability.Application.Commands;
using MySpot.Shared.Abstractions.Dispatchers;
using MySpot.Shared.Infrastructure.Modules;
\`\`\`

### Część 2: Zaimplementuj AvailabilityApiClient

Klasa \`AvailabilityApiClient\` opakowuje \`IModuleClient\` i dostarcza typowany interfejs. Znajdź TODO i zaimplementuj \`AddResourceAsync\`:

\`\`\`csharp
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
\`\`\`

### Część 3: Zamień Shared Contract na Local Contract w ParkingSpotsService

1. Zamień \`IAvailabilityModuleApi\` na \`IAvailabilityApiClient\` w konstruktorze
2. Usuń using do Shared contract i DTO
3. Zamień wywołanie na:

\`\`\`csharp
await _availabilityApiClient.AddResourceAsync(parkingSpot.Id, ParkingSpotCapacity, new[] { "parking_spot" });
\`\`\`

## Pliki do modyfikacji

- \`src/Modules/Availability/MySpot.Modules.Availability.Api/AvailabilityModule.cs\`
- \`src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Clients/AvailabilityApiClient.cs\`
- \`src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs\`
    `,
    hint: 'Start with AvailabilityModule - add the UseModuleRequests subscription first. Then implement AvailabilityApiClient.AddResourceAsync using IModuleClient. Finally, update ParkingSpotsService to use IAvailabilityApiClient instead of IAvailabilityModuleApi.',
    hintPl: 'Zacznij od AvailabilityModule - najpierw dodaj subskrypcję UseModuleRequests. Następnie zaimplementuj AvailabilityApiClient.AddResourceAsync używając IModuleClient. Na koniec zaktualizuj ParkingSpotsService, aby używał IAvailabilityApiClient zamiast IAvailabilityModuleApi.',
    solution: `
// AvailabilityModule.cs - Use method:
public void Use(IApplicationBuilder app)
{
    app.UseModuleRequests()
        .Subscribe<AddResource>("availability/resources/add", (command, serviceProvider, ct) =>
            serviceProvider.GetRequiredService<IDispatcher>().SendAsync(command, ct));
}

// AvailabilityApiClient.cs - AddResourceAsync method:
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

// ParkingSpotsService.cs - replace IAvailabilityModuleApi with IAvailabilityApiClient:
private readonly IAvailabilityApiClient _availabilityApiClient;

public ParkingSpotsService(ParkingSpotsDbContext context, IMessageBroker messageBroker,
    IAvailabilityApiClient availabilityApiClient)
{
    // ...
    _availabilityApiClient = availabilityApiClient;
}

// In AddAsync method:
await _availabilityApiClient.AddResourceAsync(parkingSpot.Id, ParkingSpotCapacity, new[] { "parking_spot" });
    `.trim(),
    solutionExplanation: `
The Local Contracts pattern provides looser coupling than Shared Contracts:

**AvailabilityModule changes:**
- \`UseModuleRequests()\` returns an \`IModuleSubscriber\` for registering handlers
- \`Subscribe<AddResource>("path", handler)\` maps the path to a handler
- The handler gets the command (deserialized from sender's object), ServiceProvider, and CancellationToken
- We use the Dispatcher to execute the command through the normal CQRS pipeline

**AvailabilityApiClient changes:**
- Wraps \`IModuleClient\` to provide a typed interface
- \`SendAsync("path", object)\` serializes the anonymous object and sends it
- The property names must match the target type (\`AddResource\` record properties)
- Handles errors and wraps them in domain-specific exceptions

**ParkingSpotsService changes:**
- Uses \`IAvailabilityApiClient\` instead of \`IAvailabilityModuleApi\`
- The API client provides a clean, typed interface

**Benefits over Shared Contracts:**
- No compile-time dependency on Availability.Shared
- Modules can evolve independently (as long as the contract is honored)
- Easier to extract to microservice later (just change transport)

**Trade-offs:**
- No compile-time type checking at the IModuleClient level
- Runtime errors if property names don't match
- Slightly more overhead (serialization/deserialization)
    `.trim(),
    solutionExplanationPl: `
Wzorzec Local Contracts zapewnia luźniejsze powiązanie niż Shared Contracts:

**Zmiany w AvailabilityModule:**
- \`UseModuleRequests()\` zwraca \`IModuleSubscriber\` do rejestracji handlerów
- \`Subscribe<AddResource>("path", handler)\` mapuje ścieżkę na handler
- Handler otrzymuje komendę (zdeserializowaną z obiektu nadawcy), ServiceProvider i CancellationToken
- Używamy Dispatchera do wykonania komendy przez normalny pipeline CQRS

**Zmiany w AvailabilityApiClient:**
- Opakowuje \`IModuleClient\` aby zapewnić typowany interfejs
- \`SendAsync("path", object)\` serializuje anonimowy obiekt i wysyła go
- Nazwy właściwości muszą odpowiadać typowi docelowemu (właściwościom rekordu \`AddResource\`)
- Obsługuje błędy i opakowuje je w wyjątki specyficzne dla domeny

**Zmiany w ParkingSpotsService:**
- Używa \`IAvailabilityApiClient\` zamiast \`IAvailabilityModuleApi\`
- Klient API zapewnia czysty, typowany interfejs

**Zalety względem Shared Contracts:**
- Brak zależności w czasie kompilacji od Availability.Shared
- Moduły mogą ewoluować niezależnie (dopóki kontrakt jest honorowany)
- Łatwiejsza ekstrakcja do mikroserwisu później (wystarczy zmienić transport)

**Kompromisy:**
- Brak sprawdzania typów w czasie kompilacji na poziomie IModuleClient
- Błędy runtime jeśli nazwy właściwości się nie zgadzają
- Nieco większy narzut (serializacja/deserializacja)
    `.trim(),
    testFilter: 'FullyQualifiedName~Exercise04',
    relatedFiles: [
      'src/Modules/Availability/MySpot.Modules.Availability.Api/AvailabilityModule.cs',
      'src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Clients/AvailabilityApiClient.cs',
      'src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Clients/IAvailabilityApiClient.cs',
      'src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs',
      'src/Shared/MySpot.Shared.Abstractions/Modules/IModuleClient.cs',
      'src/Shared/MySpot.Shared.Abstractions/Modules/IModuleSubscriber.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Modules/ModuleClient.cs'
    ]
  },
  {
    id: 'exercise-05',
    sequenceNumber: 5,
    title: 'Asynchronous Communication - Event-Driven Mapping',
    titlePl: 'Komunikacja Asynchroniczna - Mapowanie Zdarzeń',
    category: 'Asynchronous Communication',
    categoryPl: 'Komunikacja Asynchroniczna',
    timeMinutes: 20,
    description: `
# Asynchronous Communication with Mapping Module

In Exercises #3 and #4, we used **synchronous communication** - the ParkingSpots module directly called the Availability module and waited for a response. This creates **temporal coupling** - if Availability is slow or down, ParkingSpots is affected.

## The Problem with Synchronous Communication

\`\`\`
ParkingSpots ---[SendAsync]--> Availability
     |                              |
     |<-------- waits -------------|
\`\`\`

If Availability fails, ParkingSpots fails too. This is called **temporal coupling**.

## The Solution: Event-Driven Architecture

Instead of direct calls, we use **events** with **0-N receivers**:

\`\`\`
ParkingSpots --[PublishAsync]--> Event Bus ---> Mapper --[PublishAsync]--> Availability
                                          |
                                          +--> Other subscribers...
\`\`\`

The Mapping module acts as a **translation layer** (Anti-Corruption Layer) between modules.

## How It Works

1. **ParkingSpots** publishes \`ParkingSpotCreated\` event (doesn't know or care who handles it)
2. **Mapper** subscribes to \`ParkingSpotCreated\` event
3. **Mapper** translates it and publishes \`AddResource\` command to Availability
4. **Availability** handles the command

## Your Task (Two Parts)

### Part 1: Update ParkingSpotsService to publish events

Replace the synchronous \`IModuleClient.SendAsync()\` calls with event publishing:

\`\`\`csharp
// In AddAsync - replace _moduleClient.SendAsync() with:
await _messageBroker.PublishAsync(new ParkingSpotCreated(parkingSpot.Id));

// In DeleteAsync - add event publishing:
await _messageBroker.PublishAsync(new ParkingSpotDeleted(parkingSpotId));
\`\`\`

### Part 2: Implement the Mapper class

Implement the \`Mapper\` class in the Mapping module that:

1. Implements \`IEventHandler<ParkingSpotCreated>\` and \`IEventHandler<ParkingSpotDeleted>\`
2. Injects \`IMessageBroker\` via constructor
3. On \`ParkingSpotCreated\`:
   - Creates \`AddResource\` command with \`ResourceId = event.ParkingSpotId\`, \`Capacity = 2\`, \`Tags = ["parking_spot"]\`
   - Publishes via \`_messageBroker.PublishAsync()\`
4. On \`ParkingSpotDeleted\`:
   - Creates \`DeleteResource\` command with \`ResourceId = event.ParkingSpotId\`
   - Publishes via \`_messageBroker.PublishAsync()\`

## Files to Modify

- \`src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs\`
- \`src/Modules/Mapping/MySpot.Modules.Mapping.Api/ParkingSpotAvailabilityMappings/Mapper.cs\`

## Existing Types

The Commands and Events are already defined in the Mapping module:
- \`Events/ParkingSpotCreated.cs\` - event from ParkingSpots module
- \`Events/ParkingSpotDeleted.cs\` - event from ParkingSpots module
- \`Commands/AddResource.cs\` - command for Availability module
- \`Commands/DeleteResource.cs\` - command for Availability module
    `,
    descriptionPl: `
# Komunikacja Asynchroniczna z Modułem Mapowania

W ćwiczeniach #3 i #4 używaliśmy **komunikacji synchronicznej** - moduł ParkingSpots bezpośrednio wywoływał moduł Availability i czekał na odpowiedź. To tworzy **powiązanie czasowe** - jeśli Availability jest wolny lub niedostępny, ParkingSpots jest dotknięty.

## Problem z komunikacją synchroniczną

\`\`\`
ParkingSpots ---[SendAsync]--> Availability
     |                              |
     |<-------- czeka -------------|
\`\`\`

Jeśli Availability zawodzi, ParkingSpots też zawodzi. To nazywa się **powiązaniem czasowym** (temporal coupling).

## Rozwiązanie: Architektura Sterowana Zdarzeniami

Zamiast bezpośrednich wywołań, używamy **zdarzeń** z **0-N odbiorcami**:

\`\`\`
ParkingSpots --[PublishAsync]--> Event Bus ---> Mapper --[PublishAsync]--> Availability
                                          |
                                          +--> Inni subskrybenci...
\`\`\`

Moduł Mapping działa jako **warstwa translacji** (Anti-Corruption Layer) między modułami.

## Jak to działa

1. **ParkingSpots** publikuje zdarzenie \`ParkingSpotCreated\` (nie wie i nie dba kto je obsłuży)
2. **Mapper** subskrybuje zdarzenie \`ParkingSpotCreated\`
3. **Mapper** tłumaczy je i publikuje komendę \`AddResource\` do Availability
4. **Availability** obsługuje komendę

## Twoje zadanie (dwie części)

### Część 1: Zaktualizuj ParkingSpotsService do publikowania zdarzeń

Zamień synchroniczne wywołania \`IModuleClient.SendAsync()\` na publikowanie zdarzeń:

\`\`\`csharp
// W AddAsync - zamień _moduleClient.SendAsync() na:
await _messageBroker.PublishAsync(new ParkingSpotCreated(parkingSpot.Id));

// W DeleteAsync - dodaj publikowanie zdarzenia:
await _messageBroker.PublishAsync(new ParkingSpotDeleted(parkingSpotId));
\`\`\`

### Część 2: Zaimplementuj klasę Mapper

Zaimplementuj klasę \`Mapper\` w module Mapping, która:

1. Implementuje \`IEventHandler<ParkingSpotCreated>\` i \`IEventHandler<ParkingSpotDeleted>\`
2. Wstrzykuje \`IMessageBroker\` przez konstruktor
3. Na \`ParkingSpotCreated\`:
   - Tworzy komendę \`AddResource\` z \`ResourceId = event.ParkingSpotId\`, \`Capacity = 2\`, \`Tags = ["parking_spot"]\`
   - Publikuje przez \`_messageBroker.PublishAsync()\`
4. Na \`ParkingSpotDeleted\`:
   - Tworzy komendę \`DeleteResource\` z \`ResourceId = event.ParkingSpotId\`
   - Publikuje przez \`_messageBroker.PublishAsync()\`

## Pliki do modyfikacji

- \`src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs\`
- \`src/Modules/Mapping/MySpot.Modules.Mapping.Api/ParkingSpotAvailabilityMappings/Mapper.cs\`

## Istniejące typy

Komendy i Zdarzenia są już zdefiniowane w module Mapping:
- \`Events/ParkingSpotCreated.cs\` - zdarzenie z modułu ParkingSpots
- \`Events/ParkingSpotDeleted.cs\` - zdarzenie z modułu ParkingSpots
- \`Commands/AddResource.cs\` - komenda dla modułu Availability
- \`Commands/DeleteResource.cs\` - komenda dla modułu Availability
    `,
    hint: 'Start with ParkingSpotsService - replace IModuleClient.SendAsync() with IMessageBroker.PublishAsync(). Then implement the Mapper class with two interfaces: IEventHandler<ParkingSpotCreated> and IEventHandler<ParkingSpotDeleted>.',
    hintPl: 'Zacznij od ParkingSpotsService - zamień IModuleClient.SendAsync() na IMessageBroker.PublishAsync(). Następnie zaimplementuj klasę Mapper z dwoma interfejsami: IEventHandler<ParkingSpotCreated> i IEventHandler<ParkingSpotDeleted>.',
    solution: `
// Part 1: ParkingSpotsService.cs - Replace synchronous calls with event publishing

// In AddAsync method, replace _moduleClient.SendAsync() with:
await _messageBroker.PublishAsync(new ParkingSpotCreated(parkingSpot.Id));

// In DeleteAsync method, add:
await _messageBroker.PublishAsync(new ParkingSpotDeleted(parkingSpotId));

// Part 2: Mapper.cs - Implement the event handlers

internal sealed class Mapper : IEventHandler<ParkingSpotCreated>, IEventHandler<ParkingSpotDeleted>
{
    private readonly IMessageBroker _messageBroker;
    private const int ParkingSpotCapacity = 2;

    public Mapper(IMessageBroker messageBroker)
        => _messageBroker = messageBroker;

    public async Task HandleAsync(ParkingSpotCreated @event, CancellationToken cancellationToken = default)
    {
        var tags = new[] { "parking_spot" };
        await _messageBroker.PublishAsync(
            new AddResource(@event.ParkingSpotId, ParkingSpotCapacity, tags),
            cancellationToken);
    }

    public async Task HandleAsync(ParkingSpotDeleted @event, CancellationToken cancellationToken = default)
    {
        await _messageBroker.PublishAsync(
            new DeleteResource(@event.ParkingSpotId),
            cancellationToken);
    }
}
    `.trim(),
    solutionExplanation: `
The solution demonstrates the **Mapping Module** pattern for event-driven architecture:

**Why a Mapping Module?**
- Acts as an **Anti-Corruption Layer** between ParkingSpots and Availability
- Each module defines its own events/commands locally (no shared contracts needed)
- The Mapper translates between different bounded contexts

**How Event Handlers Work:**
1. \`IEventHandler<TEvent>\` interface requires implementing \`HandleAsync(TEvent, CancellationToken)\`
2. Handlers are discovered automatically via assembly scanning
3. When \`IMessageBroker.PublishAsync()\` is called, all registered handlers for that event type are invoked

**Benefits of Asynchronous Communication:**
- **No temporal coupling**: ParkingSpots doesn't wait for Availability
- **Fire and forget**: Publisher doesn't know or care about subscribers
- **Scalability**: Can add more event handlers without changing the publisher
- **Resilience**: If Availability is down, events can be queued (with proper infrastructure)

**The Event Flow:**
\`\`\`
ParkingSpots.AddAsync()
    -> publishes ParkingSpotCreated event (from ParkingSpots.Core.Events)
    -> Mapper receives ParkingSpotCreated (matches by event type name)
    -> Mapper publishes AddResource command
    -> Availability receives and processes AddResource
\`\`\`

Note: Events with the same name but different namespaces are matched by type name, enabling loose coupling.
    `.trim(),
    solutionExplanationPl: `
Rozwiązanie demonstruje wzorzec **Modułu Mapowania** dla architektury sterowanej zdarzeniami:

**Dlaczego Moduł Mapowania?**
- Działa jako **Warstwa Antykorupcyjna** między ParkingSpots i Availability
- Każdy moduł definiuje swoje zdarzenia/komendy lokalnie (brak potrzeby współdzielonych kontraktów)
- Mapper tłumaczy między różnymi kontekstami ograniczonymi

**Jak działają handlery zdarzeń:**
1. Interfejs \`IEventHandler<TEvent>\` wymaga implementacji \`HandleAsync(TEvent, CancellationToken)\`
2. Handlery są odkrywane automatycznie przez skanowanie assembly
3. Gdy wywoływane jest \`IMessageBroker.PublishAsync()\`, wszystkie zarejestrowane handlery dla tego typu zdarzenia są wywoływane

**Korzyści z komunikacji asynchronicznej:**
- **Brak powiązania czasowego**: ParkingSpots nie czeka na Availability
- **Wyślij i zapomnij**: Wydawca nie wie i nie dba o subskrybentów
- **Skalowalność**: Można dodać więcej handlerów zdarzeń bez zmiany wydawcy
- **Odporność**: Jeśli Availability jest niedostępny, zdarzenia mogą być kolejkowane (z odpowiednią infrastrukturą)

**Przepływ zdarzeń:**
\`\`\`
ParkingSpots.AddAsync()
    -> publikuje zdarzenie ParkingSpotCreated (z ParkingSpots.Core.Events)
    -> Mapper otrzymuje ParkingSpotCreated (dopasowanie po nazwie typu)
    -> Mapper publikuje komendę AddResource
    -> Availability otrzymuje i przetwarza AddResource
\`\`\`

Uwaga: Zdarzenia o tej samej nazwie ale różnych przestrzeniach nazw są dopasowywane po nazwie typu, co umożliwia luźne powiązanie.
    `.trim(),
    testFilter: 'FullyQualifiedName~Exercise05',
    relatedFiles: [
      'src/Modules/Mapping/MySpot.Modules.Mapping.Api/ParkingSpotAvailabilityMappings/Mapper.cs',
      'src/Modules/Mapping/MySpot.Modules.Mapping.Api/ParkingSpotAvailabilityMappings/Events/ParkingSpotCreated.cs',
      'src/Modules/Mapping/MySpot.Modules.Mapping.Api/ParkingSpotAvailabilityMappings/Events/ParkingSpotDeleted.cs',
      'src/Modules/Mapping/MySpot.Modules.Mapping.Api/ParkingSpotAvailabilityMappings/Commands/AddResource.cs',
      'src/Modules/Mapping/MySpot.Modules.Mapping.Api/ParkingSpotAvailabilityMappings/Commands/DeleteResource.cs',
      'src/Modules/ParkingSpots/MySpot.Modules.ParkingSpots.Core/Services/ParkingSpotsService.cs',
      'src/Shared/MySpot.Shared.Abstractions/Messaging/IMessageBroker.cs',
      'src/Shared/MySpot.Shared.Abstractions/Events/IEventHandler.cs'
    ]
  },
  {
    id: 'exercise-06',
    sequenceNumber: 6,
    title: 'Background Dispatcher - True Async',
    titlePl: 'Background Dispatcher - Prawdziwa Asynchroniczność',
    category: 'Asynchronous Communication',
    categoryPl: 'Komunikacja Asynchroniczna',
    timeMinutes: 10,
    description: `
# Background Dispatcher - True Asynchronous Communication

In Exercise #5, we switched to event-driven communication using \`IMessageBroker.PublishAsync()\`. However, there's a catch - the default implementation still processes messages **synchronously** within the same HTTP request!

## The Problem

By default, \`InMemoryMessageBroker\` delegates directly to \`IModuleClient.PublishAsync()\`:

\`\`\`
HTTP Request → ParkingSpotsService.AddAsync()
                    ↓
              _messageBroker.PublishAsync(event)
                    ↓
              IModuleClient.PublishAsync() ← Still in same HTTP context!
                    ↓
              Event handlers execute
                    ↓
              Response returned to client
\`\`\`

This means if an event handler is slow or fails, it affects the original HTTP request.

## The Solution: Background Dispatcher

Enable the **async dispatcher** to process messages through a background channel:

\`\`\`
HTTP Request → ParkingSpotsService.AddAsync()
                    ↓
              _messageBroker.PublishAsync(event)
                    ↓
              Write to Channel<MessageEnvelope> ← Returns immediately!
                    ↓
              Response returned to client

              ... later, in background ...

AsyncDispatcherJob → Read from Channel → IModuleClient.PublishAsync()
                                              ↓
                                        Event handlers execute
\`\`\`

## Your Task

Enable the async dispatcher in \`appsettings.json\`:

\`\`\`json
"messaging": {
  "useAsyncDispatcher": true
}
\`\`\`

## Observable Behavior Change

After enabling, you'll notice:
1. HTTP responses return **faster** (don't wait for event handlers)
2. Event handlers run in a **separate context** (no HTTP context access)
3. Logs show \`AsyncDispatcherJob\` processing messages

## Files to Modify

- \`src/Bootstrapper/MySpot.Bootstrapper/appsettings.json\`
    `,
    descriptionPl: `
# Background Dispatcher - Prawdziwa Asynchroniczność

W ćwiczeniu #5 przeszliśmy na komunikację sterowaną zdarzeniami używając \`IMessageBroker.PublishAsync()\`. Jednak jest pewien haczyk - domyślna implementacja nadal przetwarza wiadomości **synchronicznie** w ramach tego samego żądania HTTP!

## Problem

Domyślnie \`InMemoryMessageBroker\` deleguje bezpośrednio do \`IModuleClient.PublishAsync()\`:

\`\`\`
Żądanie HTTP → ParkingSpotsService.AddAsync()
                    ↓
              _messageBroker.PublishAsync(event)
                    ↓
              IModuleClient.PublishAsync() ← Wciąż w tym samym kontekście HTTP!
                    ↓
              Wykonanie handlerów zdarzeń
                    ↓
              Odpowiedź zwrócona do klienta
\`\`\`

To oznacza, że jeśli handler zdarzenia jest wolny lub zawiedzie, wpływa na oryginalne żądanie HTTP.

## Rozwiązanie: Background Dispatcher

Włącz **async dispatcher** aby przetwarzać wiadomości przez kanał w tle:

\`\`\`
Żądanie HTTP → ParkingSpotsService.AddAsync()
                    ↓
              _messageBroker.PublishAsync(event)
                    ↓
              Zapis do Channel<MessageEnvelope> ← Zwraca natychmiast!
                    ↓
              Odpowiedź zwrócona do klienta

              ... później, w tle ...

AsyncDispatcherJob → Odczyt z Channel → IModuleClient.PublishAsync()
                                              ↓
                                        Wykonanie handlerów zdarzeń
\`\`\`

## Twoje zadanie

Włącz async dispatcher w \`appsettings.json\`:

\`\`\`json
"messaging": {
  "useAsyncDispatcher": true
}
\`\`\`

## Obserwowalna zmiana zachowania

Po włączeniu zauważysz:
1. Odpowiedzi HTTP zwracają się **szybciej** (nie czekają na handlery zdarzeń)
2. Handlery zdarzeń działają w **osobnym kontekście** (brak dostępu do kontekstu HTTP)
3. Logi pokazują \`AsyncDispatcherJob\` przetwarzający wiadomości

## Pliki do modyfikacji

- \`src/Bootstrapper/MySpot.Bootstrapper/appsettings.json\`
    `,
    hint: 'Look at the "messaging" section in appsettings.json. The useAsyncDispatcher flag controls whether messages are processed synchronously (false) or through a background channel (true).',
    hintPl: 'Sprawdź sekcję "messaging" w appsettings.json. Flaga useAsyncDispatcher kontroluje czy wiadomości są przetwarzane synchronicznie (false) czy przez kanał w tle (true).',
    solution: `
// In appsettings.json, change:
"messaging": {
  "useAsyncDispatcher": true
}
    `.trim(),
    solutionExplanation: `
Enabling \`useAsyncDispatcher\` changes the message flow:

**Before (synchronous):**
- \`InMemoryMessageBroker.PublishAsync()\` calls \`IModuleClient.PublishAsync()\` directly
- Event handlers run in the same HTTP request context
- The HTTP response waits for all handlers to complete

**After (asynchronous):**
- \`InMemoryMessageBroker.PublishAsync()\` writes to a \`Channel<MessageEnvelope>\`
- HTTP response returns immediately
- \`AsyncDispatcherJob\` (BackgroundService) reads from the channel
- Event handlers run in a separate background context

**Key components:**
- \`IAsyncMessageDispatcher\` - writes messages to the channel
- \`IMessageChannel\` - the in-memory channel (bounded Channel<T>)
- \`AsyncDispatcherJob\` - BackgroundService that processes the channel

**Trade-offs:**
- ✅ Faster HTTP responses
- ✅ Better isolation (handler failures don't affect requests)
- ⚠️ No HTTP context in handlers
- ⚠️ Fire-and-forget (need Outbox for reliability)
    `.trim(),
    solutionExplanationPl: `
Włączenie \`useAsyncDispatcher\` zmienia przepływ wiadomości:

**Przed (synchronicznie):**
- \`InMemoryMessageBroker.PublishAsync()\` wywołuje \`IModuleClient.PublishAsync()\` bezpośrednio
- Handlery zdarzeń działają w tym samym kontekście żądania HTTP
- Odpowiedź HTTP czeka na zakończenie wszystkich handlerów

**Po (asynchronicznie):**
- \`InMemoryMessageBroker.PublishAsync()\` zapisuje do \`Channel<MessageEnvelope>\`
- Odpowiedź HTTP wraca natychmiast
- \`AsyncDispatcherJob\` (BackgroundService) odczytuje z kanału
- Handlery zdarzeń działają w osobnym kontekście w tle

**Kluczowe komponenty:**
- \`IAsyncMessageDispatcher\` - zapisuje wiadomości do kanału
- \`IMessageChannel\` - kanał w pamięci (bounded Channel<T>)
- \`AsyncDispatcherJob\` - BackgroundService przetwarzający kanał

**Kompromisy:**
- ✅ Szybsze odpowiedzi HTTP
- ✅ Lepsza izolacja (awarie handlerów nie wpływają na żądania)
- ⚠️ Brak kontekstu HTTP w handlerach
- ⚠️ Fire-and-forget (potrzeba Outbox dla niezawodności)
    `.trim(),
    testFilter: 'FullyQualifiedName~Exercise06_BackgroundDispatcher',
    relatedFiles: [
      'src/Bootstrapper/MySpot.Bootstrapper/appsettings.json',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Brokers/InMemoryMessageBroker.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Dispatchers/AsyncMessageDispatcher.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Dispatchers/AsyncDispatcherJob.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Dispatchers/IMessageChannel.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Dispatchers/MessagingOptions.cs'
    ]
  },
  {
    id: 'exercise-07',
    sequenceNumber: 7,
    title: 'Outbox Pattern - Bug Hunt',
    titlePl: 'Wzorzec Outbox - Polowanie na Błędy',
    category: 'Transactional Patterns',
    categoryPl: 'Wzorce Transakcyjne',
    timeMinutes: 20,
    description: `
# Outbox Pattern - Bug Hunt

The **Outbox Pattern** ensures reliable message delivery in distributed systems. Instead of publishing messages directly, we:

1. **Save** messages to the database (same transaction as business data)
2. **Publish** via a background processor that reads unsent messages
3. **Mark as sent** after successful publishing

This guarantees "at-least-once" delivery - messages won't be lost even if the application crashes.

## How It Works

\`\`\`
Business Logic -> Save to Outbox (DB) -> Background Processor -> Publish to Handlers
                       |                        |
                  Same transaction         Reads unsent (SentAt == null)
                                                 |
                                           Marks as sent (SentAt = now)
\`\`\`

## The Problem

Someone has introduced bug(s) in the \`EfOutbox<T>\` implementation. The tests are failing!

**Important:** There might be more than one issue to fix. Make sure all tests pass before considering the exercise complete.

## Your Task

### Step 1: Enable the Outbox Pattern

First, enable the outbox in \`appsettings.json\`:

\`\`\`json
"outbox": {
  "enabled": true,
  "intervalMilliseconds": 2000
}
\`\`\`

### Step 2: Fix the Bugs

1. Run the tests to see what's failing
2. Examine the \`EfOutbox.cs\` file carefully
3. Find and fix the bug(s)
4. Make all tests pass

**Important:** There might be more than one issue to fix. Make sure all tests pass before considering the exercise complete.

## Key Methods to Examine

- \`SaveAsync()\` - Saves messages to the outbox table
- \`PublishUnsentAsync()\` - Queries unsent messages and publishes them

## Files to Modify

- \`src/Bootstrapper/MySpot.Bootstrapper/appsettings.json\` (enable outbox)
- \`src/Shared/MySpot.Shared.Infrastructure/Messaging/Outbox/EfOutbox.cs\` (fix bugs)
    `,
    descriptionPl: `
# Wzorzec Outbox - Polowanie na Błędy

Wzorzec **Outbox** zapewnia niezawodne dostarczanie wiadomości w systemach rozproszonych. Zamiast publikować wiadomości bezpośrednio:

1. **Zapisujemy** wiadomości do bazy danych (ta sama transakcja co dane biznesowe)
2. **Publikujemy** przez procesor w tle, który odczytuje niewysłane wiadomości
3. **Oznaczamy jako wysłane** po pomyślnej publikacji

To gwarantuje dostarczenie "co najmniej raz" - wiadomości nie zostaną utracone nawet przy awarii aplikacji.

## Jak to działa

\`\`\`
Logika biznesowa -> Zapis do Outbox (DB) -> Procesor w tle -> Publikacja do handlerów
                         |                        |
                  Ta sama transakcja        Odczytuje niewysłane (SentAt == null)
                                                   |
                                             Oznacza jako wysłane (SentAt = now)
\`\`\`

## Twoje zadanie

### Krok 1: Włącz wzorzec Outbox

Najpierw włącz outbox w \`appsettings.json\`:

\`\`\`json
"outbox": {
  "enabled": true,
  "intervalMilliseconds": 2000
}
\`\`\`

### Krok 2: Napraw błędy

1. Uruchom testy, aby zobaczyć co nie działa
2. Przeanalizuj dokładnie plik \`EfOutbox.cs\`
3. Znajdź i napraw błąd(y)
4. Spraw, aby wszystkie testy przechodziły

**Ważne:** Może być więcej niż jeden problem do naprawienia. Upewnij się, że wszystkie testy przechodzą przed uznaniem ćwiczenia za ukończone.

## Kluczowe metody do zbadania

- \`SaveAsync()\` - Zapisuje wiadomości do tabeli outbox
- \`PublishUnsentAsync()\` - Pobiera niewysłane wiadomości i je publikuje

## Pliki do modyfikacji

- \`src/Bootstrapper/MySpot.Bootstrapper/appsettings.json\` (włącz outbox)
- \`src/Shared/MySpot.Shared.Infrastructure/Messaging/Outbox/EfOutbox.cs\` (napraw błędy)
    `,
    hint: 'Read through EfOutbox.cs carefully, especially SaveAsync() and PublishUnsentAsync(). Think about what each method should do: SaveAsync should persist messages to the database, and after publishing, messages should be marked as sent.',
    hintPl: 'Przeczytaj uważnie EfOutbox.cs, szczególnie SaveAsync() i PublishUnsentAsync(). Zastanów się, co powinna robić każda metoda: SaveAsync powinno zapisywać wiadomości do bazy, a po publikacji wiadomości powinny być oznaczone jako wysłane.',
    solution: `
// Bug #1 (SaveAsync): SaveChangesAsync was commented out - messages weren't persisted
await _set.AddRangeAsync(outboxMessages);
await _dbContext.SaveChangesAsync();  // <-- Uncomment this line

// Bug #2 (PublishUnsentAsync): SentAt assignment was commented out - messages never marked as sent
outboxMessage.SentAt = sentAt;  // <-- Uncomment this line
_set.Update(outboxMessage);
    `.trim(),
    solutionExplanation: `
There were **two bugs** in the EfOutbox implementation:

**Bug #1: Messages not persisted to database**
- In \`SaveAsync()\`, the \`SaveChangesAsync()\` call was commented out
- Messages were added to the DbSet but never saved to the database
- Fix: Uncomment \`await _dbContext.SaveChangesAsync();\`

**Bug #2: Messages never marked as sent**
- In \`PublishUnsentAsync()\`, the line \`outboxMessage.SentAt = sentAt\` was commented out
- Messages were published but never marked as sent, causing infinite republishing
- Fix: Uncomment \`outboxMessage.SentAt = sentAt;\`

**Why these bugs matter:**
- Bug #1: Messages never reach the outbox, so they're never published
- Bug #2: Even if published, messages keep getting republished forever (duplicate processing)
    `.trim(),
    solutionExplanationPl: `
W implementacji EfOutbox były **dwa błędy**:

**Błąd #1: Wiadomości nie zapisywane do bazy**
- W \`SaveAsync()\` wywołanie \`SaveChangesAsync()\` było zakomentowane
- Wiadomości były dodawane do DbSet, ale nigdy nie zapisywane do bazy
- Naprawa: Odkomentuj \`await _dbContext.SaveChangesAsync();\`

**Błąd #2: Wiadomości nigdy nie oznaczane jako wysłane**
- W \`PublishUnsentAsync()\` linia \`outboxMessage.SentAt = sentAt\` była zakomentowana
- Wiadomości były publikowane, ale nigdy nie oznaczane jako wysłane, co powodowało nieskończone ponowne publikowanie
- Naprawa: Odkomentuj \`outboxMessage.SentAt = sentAt;\`

**Dlaczego te błędy są ważne:**
- Błąd #1: Wiadomości nigdy nie trafiają do outboxa, więc nigdy nie są publikowane
- Błąd #2: Nawet jeśli opublikowane, wiadomości są publikowane w nieskończoność (duplikaty)
    `.trim(),
    testFilter: 'FullyQualifiedName~Exercise07',
    relatedFiles: [
      'src/Bootstrapper/MySpot.Bootstrapper/appsettings.json',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Outbox/EfOutbox.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Outbox/OutboxMessage.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Outbox/OutboxProcessor.cs',
      'src/Shared/MySpot.Shared.Infrastructure/Messaging/Outbox/IOutbox.cs'
    ]
  },
  {
    id: 'exercise-08',
    sequenceNumber: 8,
    title: 'Saga Pattern - Compensation Flow',
    titlePl: 'Wzorzec Saga - Przepływ Kompensacji',
    category: 'Transactional Patterns',
    categoryPl: 'Wzorce Transakcyjne',
    timeMinutes: 15,
    description: `
# Saga Pattern - Complete the Compensation Flow

The **Saga Pattern** coordinates long-running transactions across multiple services/modules. When something fails, it executes **compensation actions** to undo previous steps.

## How the Reservation Saga Works

\`\`\`
1. ParkingSpotReserved event starts the saga
   ↓
2. Saga publishes ReserveResource command to Availability
   ↓
   ├── Success: ResourceReserved → Saga completes ✓
   │
   └── Failure: ResourceReservationFailed → Saga compensates
                ↓
                Publishes RemoveReservation command
                ↓
                ParkingSpotReservationRemoved → Saga completes ✓
\`\`\`

## The Problem

The \`ReserveResourceHandler\` in the Availability module doesn't publish the \`ResourceReservationFailed\` event when the reservation fails. This breaks the saga compensation flow!

## Your Task

Modify \`ReserveResourceHandler\` to:

1. Wrap the reservation logic in a try-catch block
2. On exception, publish the \`ResourceReservationFailed\` event instead of letting the exception bubble up
3. The event should contain: \`resourceId\`, \`date\`, exception message as reason, and an error code

**Hint:** Look at the \`ResourceReservationFailed\` event definition to see what parameters it expects.

## How to Verify

1. Set breakpoints in:
   - \`ReservationSaga.HandleAsync(ParkingSpotReserved)\` - saga start
   - \`ReservationSaga.HandleAsync(ResourceReservationFailed)\` - compensation trigger
   - \`ReservationSaga.HandleAsync(ParkingSpotReservationRemoved)\` - saga end

2. Create a parking spot and make reservations until one fails due to capacity

3. Observe the saga flow in the debugger

## Files to Modify

- \`src/Modules/Availability/MySpot.Modules.Availability.Application/Commands/Handlers/ReserveResourceHandler.cs\`
    `,
    descriptionPl: `
# Wzorzec Saga - Przepływ Kompensacji

Wzorzec **Saga** koordynuje długotrwałe transakcje między wieloma serwisami/modułami. Gdy coś się nie powiedzie, wykonuje **akcje kompensacyjne**, aby cofnąć poprzednie kroki.

## Jak działa Saga Rezerwacji

\`\`\`
1. Zdarzenie ParkingSpotReserved rozpoczyna sagę
   ↓
2. Saga publikuje komendę ReserveResource do Availability
   ↓
   ├── Sukces: ResourceReserved → Saga kończy się ✓
   │
   └── Porażka: ResourceReservationFailed → Saga kompensuje
                ↓
                Publikuje komendę RemoveReservation
                ↓
                ParkingSpotReservationRemoved → Saga kończy się ✓
\`\`\`

## Problem

\`ReserveResourceHandler\` w module Availability nie publikuje zdarzenia \`ResourceReservationFailed\`, gdy rezerwacja się nie powiedzie. To przerywa przepływ kompensacji sagi!

## Twoje zadanie

Zmodyfikuj \`ReserveResourceHandler\`, aby:

1. Opakować logikę rezerwacji w blok try-catch
2. Na wyjątek, opublikować zdarzenie \`ResourceReservationFailed\` zamiast pozwalać wyjątkowi się propagować
3. Zdarzenie powinno zawierać: \`resourceId\`, \`date\`, komunikat wyjątku jako powód i kod błędu

**Podpowiedź:** Sprawdź definicję zdarzenia \`ResourceReservationFailed\`, aby zobaczyć jakie parametry oczekuje.

## Jak zweryfikować

1. Ustaw breakpointy w:
   - \`ReservationSaga.HandleAsync(ParkingSpotReserved)\` - start sagi
   - \`ReservationSaga.HandleAsync(ResourceReservationFailed)\` - wyzwalanie kompensacji
   - \`ReservationSaga.HandleAsync(ParkingSpotReservationRemoved)\` - koniec sagi

2. Utwórz miejsce parkingowe i wykonuj rezerwacje aż jedna się nie powiedzie z powodu pojemności

3. Obserwuj przepływ sagi w debuggerze

## Pliki do modyfikacji

- \`src/Modules/Availability/MySpot.Modules.Availability.Application/Commands/Handlers/ReserveResourceHandler.cs\`
    `,
    hint: 'Wrap the reservation logic in a try-catch block. In the catch block, publish the ResourceReservationFailed event with the resourceId, date, exception message, and an error code.',
    hintPl: 'Opakuj logikę rezerwacji w blok try-catch. W bloku catch opublikuj zdarzenie ResourceReservationFailed z resourceId, date, komunikatem wyjątku i kodem błędu.',
    solution: `
public async Task HandleAsync(ReserveResource command, CancellationToken cancellationToken = default)
{
    var (resourceId, reservationId, capacity, date, priority) = command;
    var resource = await _repository.GetAsync(resourceId);
    if (resource is null)
    {
        throw new ResourceNotFoundException(resourceId);
    }

    try
    {
        var reservation = new Reservation(reservationId, capacity, new Date(date), priority);
        resource.AddReservation(reservation);
        await _repository.UpdateAsync(resource);
        await _messageBroker.PublishAsync(new ResourceReserved(resourceId, date), cancellationToken);
    }
    catch (Exception ex)
    {
        await _messageBroker.PublishAsync(
            new ResourceReservationFailed(resourceId, date, ex.Message, "reservation_failed"),
            cancellationToken);
    }
}
    `.trim(),
    solutionExplanation: `
The solution completes the saga compensation flow:

**What We Added:**
- Try-catch block around the reservation logic
- On exception, publish \`ResourceReservationFailed\` event
- The event contains: resourceId, date, error reason, and error code

**How the Saga Responds:**
1. \`ReservationSaga\` receives \`ResourceReservationFailed\`
2. \`HandleAsync(ResourceReservationFailed)\` publishes \`RemoveReservation\` command
3. ParkingSpots module removes the reservation
4. \`ParkingSpotReservationRemoved\` event is published
5. Saga receives it and calls \`CompleteAsync()\`

**Key Saga Concepts:**
- **Orchestration**: The saga coordinates the transaction flow
- **Compensation**: When a step fails, previous steps are undone
- **Eventual Consistency**: The system becomes consistent over time
- **Chronicle Library**: Manages saga state and routing

**Note:** In production, you might want to use domain exceptions specifically rather than catching all exceptions.
    `.trim(),
    solutionExplanationPl: `
Rozwiązanie uzupełnia przepływ kompensacji sagi:

**Co dodaliśmy:**
- Blok try-catch wokół logiki rezerwacji
- Na wyjątek, publikujemy zdarzenie \`ResourceReservationFailed\`
- Zdarzenie zawiera: resourceId, date, powód błędu i kod błędu

**Jak Saga Reaguje:**
1. \`ReservationSaga\` otrzymuje \`ResourceReservationFailed\`
2. \`HandleAsync(ResourceReservationFailed)\` publikuje komendę \`RemoveReservation\`
3. Moduł ParkingSpots usuwa rezerwację
4. Publikowane jest zdarzenie \`ParkingSpotReservationRemoved\`
5. Saga je otrzymuje i wywołuje \`CompleteAsync()\`

**Kluczowe koncepcje Sagi:**
- **Orkiestracja**: Saga koordynuje przepływ transakcji
- **Kompensacja**: Gdy krok się nie powiedzie, poprzednie kroki są cofane
- **Spójność Ostateczna**: System staje się spójny z czasem
- **Biblioteka Chronicle**: Zarządza stanem sagi i routingiem

**Uwaga:** W produkcji możesz chcieć używać specyficznych wyjątków domenowych zamiast łapać wszystkie wyjątki.
    `.trim(),
    testFilter: 'FullyQualifiedName~Exercise08',
    relatedFiles: [
      'src/Modules/Availability/MySpot.Modules.Availability.Application/Commands/Handlers/ReserveResourceHandler.cs',
      'src/Modules/Availability/MySpot.Modules.Availability.Application/Events/ResourceReservationFailed.cs',
      'src/Modules/Saga/MySpot.Modules.Saga.Api/Sagas/ReservationSaga.cs',
      'src/Modules/Saga/MySpot.Modules.Saga.Api/MessagesHandler.cs',
      'src/Modules/Saga/MySpot.Modules.Saga.Api/Messages/RemoveReservation.cs'
    ]
  }
];

export const categories = [...new Set(exercises.map(e => e.category))];
