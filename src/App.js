import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import SignUp from './Components/SignUp';
import MainArea from './Components/MainArea';
import { useEffect } from 'react';

function App() {

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
