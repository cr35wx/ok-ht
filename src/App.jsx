import { DbProvider } from "./DbContext";
import HabitTracker from "./components/HabitTracker";

function App() {
  return (
    <DbProvider>
      <HabitTracker />
    </DbProvider>
  );
}

export default App;