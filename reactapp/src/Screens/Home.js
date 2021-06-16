import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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
    // console.log('______________URLRESULT1', urlResultList)
    const [checked, setChecked] = React.useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
    });
    const [checkCode, setCheckCode] = useState([]);
    const [checkName, setCheckName] = useState("");
    const [checkStatus, setCheckStatus] = useState(true);

    let code;
    // let checkBoxCode;
    let checkBoxName;
    let checkBoxStatus;
    // console.log('statudepart', checkBoxStatus)


    useEffect(() => {

        socket.on('urlFromBack', (newUrlResult) => {
            // console.log('useeffect rechargemetn')
            // console.log('okay', newUrlResult)
            setUrlResultList([...urlResultList, newUrlResult]);
            // console.log('______________URLRESULT2', urlResultList)
        }
        )
    }, [urlResultList]);

    const handleChange = (event) => {
        console.log('event', event.target.value)
        // console.log('element', element)
        setChecked({ ...checked, [event.target.name]: event.target.checked })
        console.log('checked', checked)

        checkBoxName = event.target.name
        setCheckName(checkBoxName)
        console.log('______________________name', checkName);

        // checkBoxCode = event.target.value
        // console.log("checkboxcode", checkBoxCode);
        if (!checkCode.includes(event.target.value[0])) {
            setCheckCode([...checkCode, event.target.value[0]])
        } 
        // else {
        //     var index = checkCode.indexOf(event.target.value[0]);
        //     if (index !== -1) {
        //         checkCode.splice(index, 1);
        //     }
        //     setCheckCode(checkCode)
        // }
        console.log('--------------------------------code', checkCode);

        checkBoxStatus = event.target.checked
        setCheckStatus(checkBoxStatus)
        console.log('statu', checkBoxStatus)


        // console.log('name', checkStatus)

        // console.log('display1', displayNone);
    }

    // console.log('statu1', checkStatus)



    const getCheckBox = () => {
        if (urlResultList.length > 0) {
            return (
                <div>
                    <FormControlLabel
                        control={<Checkbox checked={checked.checkedA} onChange={handleChange} name="checkedA" />}
                        label="Code 200" value="200"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked.checkedB} onChange={handleChange} name="checkedB" />}
                        label="Code 300" value="300"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked.checkedC} onChange={handleChange} name="checkedC" />}
                        label="Code 400" value="400"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={checked.checkedD} onChange={handleChange} name="checkedD" />}
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
        console.log('code', code)
        console.log('checkboxnumb', checkCode)
        
        let codeFirst = code[0]

        console.log('FIRSSSSSSSSSSSSSTTTTTTTTTTTT', codeFirst)
    

        let displayNone;
        if (checkStatus === false && checkCode.includes(codeFirst)) {

            displayNone = {
                display: 'none'
            }
        } else {
            displayNone = {
                // display : "block"
            }
        }
        // console.log('display3', displayNone);

        return (
            <tbody>
                <tr style={displayNone}>
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