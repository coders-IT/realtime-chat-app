import { useContext, useEffect } from 'react';
import './App.css';
import ChatList from './Components/ChatList';
import Chat from './Components/Chat';
import userContext from './context/userContext';

function App() {
    return (
        <>
            <div className="main">
                <ChatList />
                <Chat />
            </div>
        </>

    );
}

export default App;
