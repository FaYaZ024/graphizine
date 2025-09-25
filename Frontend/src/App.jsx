/*
import Upload from './Upload';
import { useState } from 'react';
import Border from './Borders';

function App() {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => setRefresh(!refresh);

  return (
    <>
      <Upload onUploadSuccess={triggerRefresh} />
      <Border key={refresh} />
    </>
  );
}

export default App;*/



// App.jsx

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
