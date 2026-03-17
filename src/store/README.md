# Marathon Store

## Overview

The Marathon Store is a client-side only state management solution for the challengeandgrow application. It provides centralized state management for routing between screens and maintaining marathon data entirely in browser memory.

## Architecture

### State Structure

```typescript
interface AppState {
  currentScreen: 'configuration' | 'marathon' | 'results';
  marathonConfig: MarathonConfig | null;
  marathonState: MarathonState | null;
  marathonResults: MarathonResults | null;
}
```

### Key Features

1. **In-Memory Storage**: All data stored in browser memory (no localStorage, sessionStorage, or server communication)
2. **Observer Pattern**: Subscribe/notify mechanism for reactive UI updates
3. **Screen Routing**: Manages transitions between configuration, marathon, and results screens
4. **Data Flow**: Orchestrates data flow from configuration through marathon execution to results

## API

### Methods

#### `subscribe(listener: () => void): () => void`
Subscribe to state changes. Returns an unsubscribe function.

```typescript
const unsubscribe = marathonStore.subscribe(() => {
  console.log('State changed');
});
```

#### `getState(): Readonly<AppState>`
Get the current application state.

```typescript
const state = marathonStore.getState();
console.log(state.currentScreen); // 'configuration' | 'marathon' | 'results'
```

#### `startMarathon(config: MarathonConfig): void`
Start a new marathon with the given configuration. Transitions to marathon screen.

```typescript
marathonStore.startMarathon({
  subject: 'addition',
  digitCountA: 2,
  digitCountB: 3,
  volume: 10,
  speedLimit: 30,
});
```

#### `updateMarathonState(state: MarathonState): void`
Update marathon state during active session. Only works when on marathon screen.

```typescript
marathonStore.updateMarathonState({
  config,
  currentQuestion,
  questionHistory,
  isPaused: false,
  startTime: Date.now(),
  currentQuestionStartTime: Date.now(),
  timerRemainingSeconds: 30,
  timerExpired: false,
});
```

#### `completeMarathon(results: MarathonResults): void`
Complete marathon and navigate to results screen.

```typescript
marathonStore.completeMarathon({
  config,
  questionResults,
  totalScore: 8.5,
  percentage: 85,
  totalTime: 300,
  completedAt: new Date(),
});
```

#### `returnToConfiguration(): void`
Reset all state and return to configuration screen.

```typescript
marathonStore.returnToConfiguration();
```

#### Getter Methods

- `getCurrentScreen(): AppScreen` - Get current screen
- `getMarathonConfig(): MarathonConfig | null` - Get marathon configuration
- `getMarathonResults(): MarathonResults | null` - Get marathon results

## Usage in React Components

```typescript
import { marathonStore } from './store/MarathonStore';

function App() {
  const [currentScreen, setCurrentScreen] = useState(marathonStore.getCurrentScreen());

  useEffect(() => {
    const unsubscribe = marathonStore.subscribe(() => {
      setCurrentScreen(marathonStore.getCurrentScreen());
    });
    return unsubscribe;
  }, []);

  // Render based on currentScreen
}
```

## Requirements Validation

This implementation validates the following requirements:

- **Requirement 11.1**: Store all marathon state data in browser memory during active sessions
- **Requirement 11.2**: Operate without server communication
- **Requirement 11.4**: Do not transmit user data to external servers
- **Requirement 11.5**: Do not require user authentication or account creation

## Testing

Comprehensive test coverage includes:
- Unit tests for all store methods
- Integration tests for complete application flow
- Verification of client-side only operation (no localStorage, sessionStorage, or network requests)

See `MarathonStore.test.ts` and `ApplicationFlow.test.tsx` for details.
