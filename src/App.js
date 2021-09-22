import { useContext, useEffect } from 'react';
import './App.css';
import Button from './Components/Button';
import userContext from './context/userContext';

function App() {
    const data = useContext(userContext);
    useEffect(() => {
        data.mapChats();
	},[])
    

    return (
       <Button/>
    );
}

export default App;
