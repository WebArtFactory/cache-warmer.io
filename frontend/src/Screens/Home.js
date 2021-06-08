import React, { useState } from 'react';
import Navigation from '../Components/Nav';
import Style from '../Style.css';

function Home() {

    const [url, setUrl] = useState("");

    const onSubmitUrl = async (url) => {
        console.log('url', url)
        const dataUrl = await fetch('')
    }

    return (
        <div>
            <Navigation />

            <div style={{ backgroundColor: '#FF7F50' }}>
                <p
                    style={{ color: 'white', textAlign: 'center', fontSize: '50px' }}>
                    Entrez votre URL
                </p>
                <div style={Style.input}>
                    <input 
                        onChange={(e) => setUrl(e.target.value)}
                        value={url}
                    />
                    <button onClick={() => onSubmitUrl(url)}
                    >Confirmer</button>
                </div>
            </div>

        </div>
    );
}

export default Home;