import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import SignUp from './Components/SignUp';
import MainArea from './Components/MainArea';
import { useContext, useEffect } from 'react';
import userContext from './context/userContext';

function App() {
    const data = useContext(userContext)
    useEffect(() => {
        if (data.jwtTokken) {
            window.onunload = data.setOffline;
            data.handleUserStateChg();
            data.setOnline();
        }
    }, [])
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <MainArea/>
                </Route>
                <Route exact path="/signUp">
                    <SignUp />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
