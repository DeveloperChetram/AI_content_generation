import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {store} from "./redux/store"
import { Provider} from 'react-redux'
import { HashRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
<Provider store={store}>
<HashRouter >
    <App />
</HashRouter>

</Provider>
)
