import "@/App.css";
import "leaflet/dist/leaflet.css";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import {
    Toaster
} from "sonner";

function App() {
    return ( <
        div className = "App" >
        <
        BrowserRouter >
        <
        Routes >
        <
        Route path = "/"
        element = { < Dashboard / >
        }
        /> <
        /Routes> <
        /BrowserRouter> <
        Toaster position = "bottom-right"
        theme = "light" / >
        <
        /div>
    );
}

export default App;