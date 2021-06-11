import React, { useState, useEffect } from 'react';
import Navigation from '../Components/Nav';
// import Style from '../Style.css';
import socketIOClient from 'socket.io-client';


/**
 * @todo Rajouter l'appel à un paramètre process.env.PORT
 */
let socket = socketIOClient("http://127.0.0.1:3000", { transports: ['websocket'] })
// let socket = socketIOClient("http://51.210.100.11:3000", { transports : ['websocket'] })

function Home() {

    const [url, setUrl] = useState("");
    const [urlResultList, setUrlResultList] = useState([]);
    console.log('______________URLRESULT1', urlResultList)

    let result = []

    
    useEffect(() => {
        
        socket.on('urlFromBack', (newUrlResult) => {
            console.log('okay', newUrlResult)
            // result.push(newUrlResult)
            // console.log('result', result)
         
            // console.log('newResult', newUrlResult)
            // result.push(newUrlResult)
            // console.log('result1', result)
            // setUrlResultList(result)
            // console.log('------------------URLRESULLIST', urlResultList)
            // console.log('url1', urlResultList)
        //     for (let i = 0; i < urlResultList.length; i++) {
                
        //         if (urlResultList.length===0) {
        //             result.push(newUrlResult)
        //             setUrlResultList(result)
        //             console.log('1', urlResultList)
        //         } else {
        //             setUrlResultList([...urlResultList, newUrlResult])
        //             console.log('2', urlResultList)

        //         }
        // }
        // setUrlResultList([result])
        setUrlResultList([...urlResultList, newUrlResult])
    }
    )
    },[]);
    
    let urlResultItem = urlResultList.map((url, i) => {
        return (
            <p key={i}>{url}</p>
        )
    })

    return (
        <div>
            <Navigation />

            <div style={{ backgroundColor: '#FF7F50' }}>
                <p
                    style={{ color: 'white', textAlign: 'center', fontSize: '50px' }}>
                    Entrez votre URL
                </p>
                <div className="inputButton">
                    <input
                        className="input"
                        placeholder="Mon URL"
                        onChange={(e) => setUrl(e.target.value)}
                        value={url}
                    />
                    <button
                        className="button"
                        onClick={() => socket.emit("urlFromFront", url)}
                    >Confirmer</button>
                </div>
            </div>
            <div>
                {urlResultItem}
            </div>

        </div>
    );
}

export default Home;