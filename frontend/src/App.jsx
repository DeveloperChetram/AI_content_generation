import Navbar from "./components/Navbar"
import Dashboard from "./pages/Dashboard"
// import ReduxSample from "./components/ReduxSample"

import Login from "./pages/Login"

import MainRoutes from "./routes/MainRoutes"




const App = () => {


  return (
    <div>
      <Navbar />
      {/* <DurationExample /> */}
      {/* <AlertUsageExample /> */}
      <MainRoutes />
    
      {/* <DynamicIsland /> */}
      {/* <Login/> */}
      {/* <ReduxSample /> */}
      {/* <Dashboard /> */}
       
    </div>
  )
}

export default App
