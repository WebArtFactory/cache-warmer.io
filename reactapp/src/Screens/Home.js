import React, {useEffect, useState} from 'react';
import {Table} from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Navigation from '../Components/Nav';
import socketIOClient from 'socket.io-client';


function Home() {
    const [urlResultList, setUrlResultList] = useState([]);
    const [checked, setChecked] = React.useState({
        "2": true,
        "3": true,
        "4": true,
        "5": true,
    });
    const [totalUrl, setTotalUrl] = useState();
    let code;

    // const [url, setUrl] = useState("");
    console.log('______________URLRESULT0', urlResultList)

    /**
     * On définit le socket.io à l'interieur de la fonctione Home(), de manière à ce qu'il soit bien détruit
     * à chaque rechargement.
     * C'est précisement ce point qui a réglé le problème d'envoie multiple sur le front.
     *
     * @todo Rajouter l'appel à un paramètre process.env.PORT
     */
    let socket = socketIOClient("127.0.0.1:3000", {transports: ['websocket']})
    // let socket = socketIOClient("51.210.100.11:3000", {transports: ['websocket']})

    useEffect(() => {
        socket.on('urlFromBack', (newUrlResult) => {
            // console.log('urlFromBack : ', newUrlResult)
            // console.log('urlResultList : ', urlResultList)

            /**
             * @see https://stackoverflow.com/questions/60658254/socket-io-listener-firing-too-many-times-in-functional-react
             * Comme indiqué dans la réponse, cette syntaxe permet de faire appel à la valeure précédente de notre urlResultList.
             *
             * J'ai mis totoToRename mais j'aurais pu mettre n'importe quoi
             *
             * Pour finir, je met newUrlResult en 1er pour inverser l'ordre d'affichage (la plus récente en haut de liste)
             */
            setUrlResultList(totoToRename => [newUrlResult, ...totoToRename]);
        });
    }, [urlResultList]);

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
        let checkedStatus = {...checked, [event.target.name]: event.target.checked}
        setChecked(checkedStatus)
    }


    const getCheckBox = () => {
        if (urlResultList.length > 0) {
            return (
                <div className="checkbox">
                    <FormControlLabel
                        control={<Checkbox checked={checked["2"]} onChange={handleChange} name="2"/>}
                        label="Code 200" value="200"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked["3"]} onChange={handleChange} name="3"/>}
                        label="Code 300" value="300"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked["4"]} onChange={handleChange} name="4"/>}
                        label="Code 400" value="400"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked["5"]} onChange={handleChange} name="5"/>}
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
            <tr key={i} style={displayNone}>
                <td>{url}</td>
                <td>{date}</td>
                <td>{hours}</td>
                <td>{code}</td>
            </tr>
        )
    })

    return (
        <div>
            <Navigation/>

            <div style={{backgroundColor: '#FF7F50'}}>
                <p
                    style={{color: 'white', textAlign: 'center', fontSize: '50px'}}>
                    Entrez votre URL
                </p>
                <div className="inputButton">
                    <input
                        id="url-input"
                        className="input"
                        placeholder="Mon URL"
                    />
                    <button
                        className="button"
                        onClick={() => socket.emit("urlFromFront", document.getElementById('url-input').value)}
                    >Confirmer
                    </button>
                </div>
            </div>
            <div className="table">
                {/* {getProgressiveBar()} */}
            </div>
            {getCheckBox()}
            <div>
                <Table className="table">
                    {getTable()}
                    <tbody>
                    {urlResultItem}
                    </tbody>
                </Table>

            </div>

        </div>
    );
}

export default Home;