// eslint-disable-next-line react/prop-types
import useWebSocket from "react-use-websocket";
import {useEffect, useRef} from "react";
import throttle from 'lodash.throttle';
import {Cursor} from "./components/Cursor.jsx";

const renderCursor = (users) => {
    return Object.keys(users).map(uuid => {
        const user = users[uuid]
        return (
            <Cursor key={uuid} point={[user.state.x, user.state.y]}/>
        )
    });
}

const renderUsersList = (users) => {
    return (
        <ul>
            {Object.keys(users).map(uuid => {
                return <li key={uuid}>{JSON.stringify(users[uuid])}</li>
            })}
        </ul>
    )

}

export function Home({username}) {

    const {sendJsonMessage, lastJsonMessage} = useWebSocket(`ws://localhost:8000`, {
        share: true,
        queryParams: {
            username,
        }
    })

    const THROTTLE = 50;
    const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE));

    useEffect(() => {

        sendJsonMessage({
            x: 0,
            y: 0,
        })

        const tt = (e) => {
            sendJsonMessageThrottled.current({
                x: e.clientX,
                y: e.clientY
            })
        }

        window.addEventListener('mousemove', tt)

        return () => {
            window.removeEventListener('mousemove', tt)
        }

    }, []);

    if (lastJsonMessage) {
        return <div>
            {renderCursor(lastJsonMessage)}
            {renderUsersList(lastJsonMessage)}
        </div>

    }

    return <h1>Hello, {username}</h1>;
}