import { useContext, useEffect } from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import SignUp from './Components/SignUp';
import MainArea from './Components/MainArea';

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
