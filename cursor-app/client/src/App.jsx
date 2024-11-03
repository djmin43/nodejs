import Login from "./components/Login.jsx";
import {useState} from "react";
import {Home} from "./Home.jsx";


function App() {
    const [username, setUsername] = useState("");

    return username ? <Home username={username} /> : <Login onSubmit={setUsername}/>

}

export default App