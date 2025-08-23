import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
// import ReduxSample from "./components/ReduxSample"

import Login from "./pages/Login"

import MainRoutes from "./routes/MainRoutes"

const App = () => {


  return (
    <div>
      <Navbar />
      <MainRoutes />
      {/* <Login/> */}
      {/* <ReduxSample /> */}
      {/* <Dashboard /> */}
       
    </div>
  )
}

export default App
