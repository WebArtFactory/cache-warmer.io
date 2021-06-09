import React, { useState, useEffect } from 'react';
import Navigation from '../Components/Nav';
// import Style from '../Style.css';
import socketIOClient from 'socket.io-client';

let socket = socketIOClient("http://192.168.1.190:3000", { transports : ['websocket'] })

function Home() {

    const [url, setUrl] = useState("");
    const [urlResultList, setUrlResultList] = useState([]);


    useEffect(() => {
        socket.on('urlFromBack', (newUrlResult) => {
            console.log('newResult', newUrlResult)
            setUrlResultList([...urlResultList, newUrlResult]);
        });
    }, [urlResultList]);

    return (
        <div>
            <Navigation />

            <div style={{ backgroundColor: '#FF7F50' }}>
                <p
                    style={{ color: 'white', textAlign: 'center', fontSize: '50px' }}>
                    Entrez votre URL
                </p>
                <div className = "inputButton">
                    <input
                        className = "input"
                        placeholder = "Mon URL"
                        onChange={(e) => setUrl(e.target.value)}
                        value={url}
                    />
                    <button 
                    className = "button"
                    onClick={() => socket.emit("urlFromFront", url)}
                    >Confirmer</button>
                </div>
            </div>

        </div>
    );
}

export default Home;