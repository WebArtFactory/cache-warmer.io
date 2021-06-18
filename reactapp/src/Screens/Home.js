import React, { useState, useEffect } from 'react';
import { Table, Progress } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Navigation from '../Components/Nav';
import socketIOClient from 'socket.io-client';
import Style from '../Style.css';


/**
 * @todo Rajouter l'appel à un paramètre process.env.PORT
 */
let socket = socketIOClient("http://127.0.0.1:3000", { transports: ['websocket'] })
// let socket = socketIOClient("http://51.210.100.11:3000", { transports : ['websocket'] })

function Home() {

    const [url, setUrl] = useState("");
    const [urlResultList, setUrlResultList] = useState([]);
    // console.log('______________URLRESULT1', urlResultList)
    const [checked, setChecked] = React.useState({
        "2": true,
        "3": true,
        "4": true,
        "5": true,
    });
    // const [totalUrl, setTotalUrl] = useState();


    let code;


    useEffect(() => {
        socket.on('urlFromBack', (newUrlResult) => {
            // console.log('newurl', newUrlResult)
            // let newUrl = []
            // newUrl.push(newUrlResult)
            setUrlResultList([...urlResultList, newUrlResult]);
            console.log('urlList1', urlResultList)
        });
    }, [urlResultList]);

    // console.log('urlList2', urlResultList)


    // socket.on('countFromBack', (urlCount) => {
    //     console.log(urlCount)
    //     setTotalUrl(urlCount)
    // })
    // console.log('total', totalUrl)

    // const getProgressiveBar = () => {
    //     if (totalUrl > 0) {
    //         let progressValue = ((urlResultList.length * 100) / totalUrl)
    //         // console.log('urllist', urlResultList.length)
    //         // console.log('progress', progressValue)
    //         return (
    //             <Progress animated value={progressValue} />
    //         )
    //     }
    // }

    const handleChange = (event) => {
        let checkedStatus = { ...checked, [event.target.name]: event.target.checked }
        setChecked(checkedStatus)
    }



    const getCheckBox = () => {
        if (urlResultList.length > 0) {
            return (
                <div className="checkbox">
                    <FormControlLabel
                        control={<Checkbox checked={checked["2"]} onChange={handleChange} name="2" />}
                        label="Code 200" value="200"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked["3"]} onChange={handleChange} name="3" />}
                        label="Code 300" value="300"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked["4"]} onChange={handleChange} name="4" />}
                        label="Code 400" value="400"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked["5"]} onChange={handleChange} name="5" />}
                        label="Code 500" value="500"
                    />

                </div>
            )
        }
    }

    const getTable = () => {
        if (urlResultList.length > 0) {
            return (
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Code réponse HTTP</th>
                    </tr>
                </thead>
            )
        }
    }

    let urlResultItem = urlResultList.map((element, i) => {
        let newFormat = element.split([","])
        let newFormatDate = newFormat[2].split([" "])
        let date = newFormatDate[1]
        let hours = newFormatDate[2]
        let url = newFormat[0]
        code = newFormat[1]
        // console.log('code', code)
        // console.log('1ere lettre du code de la ligne', code[0])
        // console.log('on ajoute deux zero a la premiere lettre', code[0])
        // console.log('si la premiere lettre du code de la ligne est coché, on affiche sinon on masque')
        // console.log('valeur de nos cases : ', checked)
        // console.log('valeur de la case pour la ligne en cours : ', checked[code[0]])

        let displayNone = {};
        if (checked[code[0]] === false) {
            displayNone = {
                display: 'none'
            }
        }

        return (
            <tbody>
                <tr key={i} style={displayNone}>
                    <td>{url}</td>
                    <td>{date}</td>
                    <td>{hours}</td>
                    <td>{code}</td>
                </tr>
            </tbody>

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
            <div className="table">
                {/* {getProgressiveBar()} */}
            </div>
            {getCheckBox()}
            <div>
                <Table className="table">
                    {getTable()}
                    {urlResultItem}
                </Table>

            </div>

        </div>
    );
}

export default Home;