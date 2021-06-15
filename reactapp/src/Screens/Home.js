import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
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

    // let result = []

    useEffect(() => {

        socket.on('urlFromBack', (newUrlResult) => {
            console.log('useeffect rechargemetn')
            console.log('okay', newUrlResult)
            setUrlResultList([...urlResultList, newUrlResult]);
            console.log('______________URLRESULT2', urlResultList)
        }
        )
    }, [urlResultList]);


    let urlResultItem = urlResultList.map((element, i) => {
        let newFormat = element.split([","])
        console.log('newformat', newFormat)
        let newFormatDate = newFormat[2].split([" "])
        console.log('date', newFormatDate)
        let date = newFormatDate[1]
        let hours = newFormatDate[2]
        let url = newFormat[0]
        let code = newFormat[1]
        
        return (
            // <p key={i}>{url}</p>
            <tr>
                <td>{url}</td>
                <td>{date}</td>
                <td>{hours}</td>
                <td>{code}</td>
            </tr>

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
                <Table className="table">
                    <thead>
                        <tr>
                            <th>URL</th>
                            <th>Date</th>
                            <th>Heure</th>
                            <th>Code réponse HTTP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {urlResultItem}
                    </tbody>
                </Table>

            </div>

        </div>
    );
}

export default Home;