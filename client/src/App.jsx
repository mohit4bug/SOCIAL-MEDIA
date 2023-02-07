import './App.css'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet
} from "react-router-dom"
import Home from './pages/Home'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Navbar from './components/Navbar'
import Feed from './pages/Feed'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import { ThemeProvider } from 'styled-components'
import { useContext, useState } from 'react'
import { darkTheme, lightTheme } from './theme'
import { DarkModeContext } from './context/darkModeContext'
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './context/authContext'
import { Navigate } from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'



function App() {
  const queryClient = new QueryClient()

  const { darkMode } = useContext(DarkModeContext)
  const { user } = useContext(AuthContext)

  const Layout = () => {
    return (
      <div>
        <Navbar />
        <Outlet />
      </div>
    )
  }
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/signin" />
    }
    return children
  }


  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/signin',
      element: <Signin />
    },
    {
      path: '/signup',
      element: <Signup />
    },
    {
      path: '/',
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          path: '/feed',
          element: <Feed />
        },
        {
          path: '/explore',
          element: <Explore />
        },
        {
          path: '/profile/:id',
          element: <Profile />
        }
      ]
    },
    {
      path: '*',
      element: <div>404</div>
    }
  ])




  return (
    <ThemeProvider theme={darkMode === "dark" ? darkTheme : lightTheme}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
