import react, { useContext } from 'react'
import userContext from '../context/userContext'
import MessageCard from './MessageCard';

export default function UnreadMessage(props) {

	const data = useContext(userContext);
    if (data.unreadmessage.length) {
        return (
            <>
                <hr />
                {
                    data.unreadmessage.map((elem) => {
                        return <MessageCard key={elem.time} message={elem} />
                    })
                }
            </>
        )
    } else return (<></>);

}