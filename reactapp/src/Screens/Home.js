import React, { useEffect, useState } from 'react';
import { Table, Progress, Container, Row, Col } from 'reactstrap';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Navigation from '../Components/Nav';
import socketIOClient from 'socket.io-client';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

// let socket;

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '50ch',
        },
    }, formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

function Home() {
    const [urlResultList, setUrlResultList] = useState([]);
    const [checked, setChecked] = React.useState({
        "2": true,
        "3": true,
        "4": true,
        "5": true,
    });
    const [totalUrl, setTotalUrl] = useState(0);
    const [robot, setRobot] = useState(1);
    console.log('robot', robot)
    const [url, setUrl] = useState("");
    console.log('url', url)
    let code;
    // let test = [];

    const classes = useStyles();

    /**
     * On définit le socket.io à l'interieur de la fonctione Home(), de manière à ce qu'il soit bien détruit
     * à chaque rechargement.
     * C'est précisement ce point qui a réglé le problème d'envoie multiple sur le front.
     *
     * @todo Rajouter l'appel à un paramètre process.env.PORT
     */
    // let socket = socketIOClient("51.210.100.11:3000", {transports: ['websocket']})

    let socket = socketIOClient("http://192.168.1.190:3000", { transports: ['websocket'] })
    // useEffect(()=>{
    //     handleClick()
    // }, [])

    useEffect(() => {

        socket.on('urlFromBack', (newUrlResult) => {

            console.log('urlFromBack : ', newUrlResult)
            // console.log('urlResultList : ', urlResultList)
            // test.push(newUrlResult)
            /**
             * @see https://stackoverflow.com/questions/60658254/socket-io-listener-firing-too-many-times-in-functional-react
             * Comme indiqué dans la réponse, cette syntaxe permet de faire appel à la valeure précédente de notre urlResultList.
             *
             * J'ai mis totoToRename mais j'aurais pu mettre n'importe quoi
             *
             * Pour finir, je met newUrlResult en 1er pour inverser l'ordre d'affichage (la plus récente en haut de liste)
             */
            // setRobot(newUrlResult.robot)
            setUrlResultList(totoToRename => [newUrlResult, ...totoToRename]);
        });
        socket.on('countFromBack', (urlCount) => {
            // console.log('urlcount', urlCount)
            setTotalUrl(urlCount)
        })
        // const interval = setInterval(() => {
        //     if (test.length > 0) {
        //     }
        // },5000)
        // return () => clearInterval(interval)

    }, [urlResultList, robot, socket]);



    // console.log('total', totalUrl)
    // console.log('length', urlResultList.length)

    const getProgressiveBar = () => {
        if (urlResultList.length > 0) {
            let progressValue = ((urlResultList.length * 100) / totalUrl)
            // console.log('urllist', urlResultList.length)
            // console.log('progress', progressValue)
            return (
                <Progress animated value={progressValue} />
            )
        }
    }

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

    // const changeRobot = (event) => {
    //     setRobot(event)
    // }
    const handleClick = async () => {
        console.log('urldans fonction', url)
        console.log('robotdansfonction', robot)
        await socket.emit("urlFromFront", { url, robot })
    }

    console.log('url en dehors fonction', url)
    console.log('robot en dehors fonction', robot)

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
            <Navigation />

            <div>
                <img className="banniere" src={('../images/bannieref.png')} alt="banniere" />
            </div>


            <Container fluid>

                <Row>
                    <Col className='containerText'>
                        <p className='textBanniere'> Génère automatiquement le cache de votre site web</p>

                    </Col>
                </Row>




                <Row className='inputsContainer'>
                    <Col className="textDesc">
                        <p className='text'>Mon URL à parcourir : </p>
                    </Col>
                    <Col>
                        <div>
                            {/* <input
                                className="input"
                                placeholder="Mon URL"
                                onChange={(e) => setUrl(e.target.value)}
                                value={url}
                            /> */}
                            <form className={classes.root} noValidate autoComplete="off">
                                <TextField id="outlined-basic" label="Mon URL" variant="outlined" className="inputField"
                                    onChange={(e) => setUrl(e.target.value)} value={url}
                                />
                            </form>
                        </div>
                    </Col>
                </Row>
                <Row className='inputsContainer'>
                    <Col className="textDesc">
                        <p className='text'>
                            Nombre de Robot
                        </p>
                    </Col>
                    <Col>
                        {/* <form className="inputButton select">
                            <select onChange={(e) => setRobot(e.target.value)} value={robot}>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="5">5</option>
                                <option value="10">10</option>
                            </select>
                        </form> */}
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel id="demo-simple-select-outlined-label">Nombre de robot</InputLabel>
                            <Select
                                labelId="demo-simple-select-outlined-label"
                                id="demo-simple-select-outlined"
                                value={robot}
                                onChange={(e) => setRobot(e.target.value)}
                                label="Robot"
                            >
                                <MenuItem value={robot}>
                                    <em>None</em>
                                </MenuItem>
                                <MenuItem value="1">1</MenuItem>
                                <MenuItem value="2">2</MenuItem>
                                <MenuItem value="3">3</MenuItem>
                                <MenuItem value="5">5</MenuItem>
                                <MenuItem value="10">10</MenuItem>
                            </Select>
                        </FormControl>


                    </Col>
                </Row>
                <Row className='inputsContainer'>
                    <Col className="confirmer">
                        <Button color="primary" size="lg" className="button" block
                            // className={classes.margin, 'button'}
                            onClick={() => handleClick()} >
                            Lancer le cache Crawler
                        </Button>
                    </Col>
                </Row>

            </Container>

            <div className="table">
                {getProgressiveBar()}
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

        </div >
    );
}

export default Home;