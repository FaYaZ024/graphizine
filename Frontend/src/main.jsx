import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Upload from './Upload.jsx'
import Categories from './Categories.jsx'
import CategoryPages from './Categorypages.jsx'
import Login from './Login.jsx'
import Layout from './Layout.jsx'
import AdminLogin from './AdminLogin.jsx'
import { useState } from 'react';
import { UserProvider } from './Context.jsx'

function MainApp() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <UserProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<App />} />
            <Route
              path="/Upload"
              element={
                isAdmin
                  ? <Upload />
                  : <AdminLogin onLogin={() => setIsAdmin(true)} />
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/:categoryName" element={<CategoryPages />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </UserProvider>
  );
}

// Render MainApp instead of just the Router:
createRoot(document.getElementById('root')).render(<MainApp />)
