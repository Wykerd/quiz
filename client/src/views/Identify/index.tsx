import React, { useEffect, useState } from 'react';

import './index.css';

export interface IdentifyProps {
    data: any;
    onDone: (i: any) => void
} 

const Identify : React.FC<IdentifyProps> = ({ data, onDone }) => {
    const [ info, setInfo ] = useState<{ [key: string]: string }>({});

    const [ nickname, setNickname ] = useState<string>('');

    const [ error, setError ] = useState<string>('');

    async function handleSubmit(e : React.FormEvent<HTMLFormElement>) {
        e.stopPropagation();
        e.preventDefault();
        if (!nickname) return alert('Please enter your name to continue');
        try {
            onDone(await (await fetch(`http://quiz.wykerd.io/api/${data._id}/init`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    info,
                    nickname
                })
            })).json());
        } catch (error) {
            setError(error);
        }
    }

    function handleChange (key: string, value: string) {
        const newState = {...info};
        newState[key] = value;
        setInfo(newState);
    }

    if (error) return <div>Error: {JSON.stringify(error)}</div>

    return <div id="ident">
        <header>
            {data.name || 'NO NAME BRAND'}
        </header>
        <main>
            <h1>Who are you?</h1>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    placeholder="Your Name + Surname" 
                    value={nickname} 
                    onChange={e => setNickname(e.target.value)} />
                {
                    Object.keys(data.info).map(key => <input 
                        key={key}
                        type="text" 
                        placeholder={data.info[key]} 
                        onChange={e => handleChange(data.info[key], e.target.value) }
                        value={info[key]}
                        />)
                }
                <input type="submit" value="Let's Go" />
            </form>
        </main>
        <footer>
            <span>Copyright 2020, Daniel Wykerd</span>
            <a href="https://github.com/Wykerd/quiz">View Source on Github</a>
        </footer>
    </div>
}

export default Identify;