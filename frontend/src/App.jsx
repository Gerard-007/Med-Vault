import { createBrowserRouter, RouterProvider } from "react-router-dom"
import HEALTH_RECORD_ROUTES from "./router/Routes"


function App() {

  const router = createBrowserRouter([
    ...HEALTH_RECORD_ROUTES,
  ])
  return (
    <>
    <RouterProvider router={router} />
   
      
    </>
  )
}

export default App
