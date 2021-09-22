import React, { useContext } from 'react'
import userContext from '../context/userContext';

export default function Button() {
    const data = useContext(userContext);
    const clicker = () => {
        data.mapChats()
    }
    return (
        <div>
            <button onClick={clicker}>{data.userDetail.username}</button>
        </div>
    )
}
