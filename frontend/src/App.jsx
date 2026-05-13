import React from 'react'
import TestBackend from './components/TestBackend'
import RootLayout from './components/RootLayout'

import { createBrowserRouter, RouterProvider } from "react-router"

function App() {

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "/test-backend",
          element: <TestBackend />
        }
      ]
    }
  ])
  return (
    <RouterProvider router={routerObj}></RouterProvider>
  )
}

export default App