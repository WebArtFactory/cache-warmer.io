import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import EmailIcon from '@material-ui/icons/Email';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';


const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
        width: '50%',
        justifyContent: 'center'
    },
}));

function Login() {

    //variable d'état pour les inputs et infos à envoyer au back
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    //variable d'état pour vérifier si un utilisateur existe ou pas
    const [userExist, setUserExist] = useState(false);

    //variable d'états pour les erreurs
    const [errorsListSignUp, setErrorsListSignUp] = useState([]);
    const [errorsListSignIn, setErrorsListSignIn] = useState([]);

    const classes = useStyles();

    //Regex pour vérifier que l'email est correct
    const validate = (email) => {
        const expression =
            /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase());
    };

    //traitement de l'information pour un utilisateur qui a deja un compte
    const handleClickSignIn = async () => {
        console.log('click sign in okay')

        if (validate(email) === false) {
            setErrorsListSignIn(["Le format de l'adresse mail n'est pas valide"])
        } else {
            const data = await fetch('/account/signin', {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `emailFromFront=${email}&passwordFromFront=${password}`
            })

            const body = await data.json()
            console.log("body", body)

            if (body.result === true) {
                setUserExist(true)
            } else {
                setErrorsListSignIn(body.error)
            }
        }
    }

    //traitement de l'information pour un utilisateur qui créer un compte
    const handleClickSignUp = async () => {
        console.log('click signup okay')

        if (validate(newEmail) === false) {
            setErrorsListSignUp(["Le format de l'adresse mail n'est pas valide"])
        } else {
            const data = await fetch('/account/signup', {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `emailFromFront=${newEmail}&passwordFromFront=${newPassword}&nameFromFront=${name}&firstNameFromFront=${firstName}`
            })

            const body = await data.json()
            console.log("body", body)

            if (body.result === true) {
                setUserExist(true)
            } else {
                setErrorsListSignUp(body.error)
            }
        }
    }

    //redirection sur la page home si le backend renvoit un result = true
    if (userExist) {
        return (
            <Redirect to='/home' />
        )
    }

    //affichage des erreurs pour signup
    let errorSignUp = errorsListSignUp.map((errorItem, i) => {
        return (
            <Row>
                <p key={i} className="error">{errorItem}</p>
            </Row>
        )
    })

    //affichage des erreurs pour sign in
    let errorSignIn = errorsListSignIn.map((errorItem, i) => {
        return (
            <Row>
                <p key={i} className="error">{errorItem}</p>
            </Row>
        )
    })


    return (
        <Container fluid>
            <Row>
                <Col>
                    <div>
                        <img className="banniere" src={('../images/bannieref.png')} alt="banniere" />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col className="loginField">
                    <p className="loginText">Connectez-vous</p>
                    <Row>
                        <TextField
                            className={classes.margin}
                            id="input-with-icon-textfield"
                            label="E-mail"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                    </Row>
                    <Row>
                        <TextField
                            className={classes.margin}
                            id="input-with-icon-textfield"
                            label="Mot de passe"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </Row>
                    {errorSignIn}
                    <Button color="primary" size="lg" className="button" onClick={() => handleClickSignIn()}>
                        Je me connecte
                    </Button>
                </Col>
                <Col className="loginField">
                    <p className="loginText">Vous n'avez pas de compte ? Créez en un !</p>
                    <Row>
                        <TextField
                            className={classes.margin}
                            id="input-with-icon-textfield"
                            label="Prénom"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                        />
                    </Row>
                    <Row>
                        <TextField
                            className={classes.margin}
                            id="input-with-icon-textfield"
                            label="Nom"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircleIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />
                    </Row>
                    <Row>
                        <TextField
                            className={classes.margin}
                            id="input-with-icon-textfield"
                            label="E-mail"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setNewEmail(e.target.value)}
                            value={newEmail}
                        />
                    </Row>
                    <Row>
                        <TextField
                            className={classes.margin}
                            id="input-with-icon-textfield"
                            label="Mot de passe"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnKeyIcon />
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                        />
                    </Row>
                    <Row>
                        {errorSignUp}
                        <Button color="primary" size="lg" className="button" onClick={() => handleClickSignUp()}>
                            Je créer mon compte
                        </Button>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;