import React, { useState, useEffect } from 'react';
import { Table } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Navigation from '../Components/Nav';
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
    const [checked, setChecked] = useState({
        checkedA: true,
        checkedB: true,
        checkedC: true,
        checkedD: true,
    });
    const [checkCode, setCheckCode] = useState([]);
    const [checkName, setCheckName] = useState("");
    const [checkStatus, setCheckStatus] = useState(true);
    console.log('checked0', checked)


    let code;
    // let checkBoxCode;
    let checkBoxName;
    let checkBoxStatus;
    let isChecked;


    useEffect(() => {

        socket.on('urlFromBack', (newUrlResult) => {  
            setUrlResultList([...urlResultList, newUrlResult]);
        }
        )
    }, [urlResultList]);

    const handleChange = (event) => {
        console.log('event', event.target.checked)
        // console.log('element', element)
        
        //Set si la case est cochée ou non
        console.log('checked1', checked)
        // checked[event.target.name] = event.target.checked;
        
        isChecked = {...checked, [event.target.name]: event.target.checked} 
        console.log('test', isChecked)
        setChecked(isChecked)
        console.log('checked2', checked)
        
        checkBoxStatus = event.target.checked
        console.log('---variablecheckstatus', checkBoxStatus)
        setCheckStatus(checkBoxStatus)
        console.log('---checkstatus', checkStatus)

        //Set le nom de la check box
        checkBoxName = event.target.name
        console.log('____________________variablename', checkBoxName)
        setCheckName(checkBoxName)
        console.log('______________________name', checkName);


        //Set le code de la check box
        let codeIn = []
        if (checkCode.length===0 && event.target.checked===false) {
            // codeIn.push(event.target.value[0])
            codeIn.push({code : event.target.value[0], status : event.target.checked})
            console.log('codein', codeIn)
            setCheckCode(codeIn)
        }
        else if (!checkCode.includes(event.target.value[0]) && event.target.checked===false) {
            setCheckCode([...checkCode, event.target.value[0]])
        } 
        else if (event.target.value[0] === checkCode.find(element=>element===(event.target.value[0]))) {
            checkCode.splice(checkCode.indexOf(event.target.value[0]), 1)
        }
     
        console.log('--------------------------------code', checkCode);


    }

    console.log('checked3', checked)
    console.log('test2', isChecked)
    console.log('---checkstatus2', checkStatus)
    console.log('--------------------------------------------------------code1', checkCode);
    console.log('name2', checkName);


  



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
        // console.log('code', code)
        // console.log('checkboxnumb', checkCode)
        
        let codeFirst = code[0]

        // console.log('FIRSSSSSSSSSSSSSTTTTTTTTTTTT', codeFirst)
    

        let displayNone = {};
        if (checkStatus === false && checkCode.includes(codeFirst) ) {
            displayNone = {
                display: 'none'
            }
        }

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