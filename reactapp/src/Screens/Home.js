import React, { useState, useEffect } from 'react';
import Navigation from '../Components/Nav';
// import Style from '../Style.css';
import socketIOClient from 'socket.io-client';


/**
 * @todo Rajouter l'appel à un paramètre process.env.PORT
 */
let socket = socketIOClient("http://127.0.0.1:3000", { transports : ['websocket'] })
// let socket = socketIOClient("http://51.210.100.11:3000", { transports : ['websocket'] })

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