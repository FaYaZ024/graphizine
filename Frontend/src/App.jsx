import Home from './Home';
import { UserProvider } from "./Context";

function App() {

  

  return (
   <UserProvider>
    <div>
      <Home />
    </div>
</UserProvider>
  );
}

export default App;
