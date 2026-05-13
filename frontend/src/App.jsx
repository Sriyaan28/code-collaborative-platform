import React from 'react'
import TestBackend from './components/TestBackend'
import RootLayout from './components/RootLayout'

import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"

function App() {

  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/test-backend" replace />
        },
        {
          path: "test-backend",
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