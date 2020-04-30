import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Identify from '../Identify';
import Quiz from '../Quiz';
import EndScreen from '../EndScreen';

const Game: React.FC = (props) => {
    const params = useParams<{id: string}>();

    const [ gameData, setGameData ] = useState<any>(false);
    const [ details, setDetails ] = useState<any>(false);
    const [ error, setError ] = useState<any>(false);

    useEffect(() => {
        (async () => setDetails(await (await fetch(`http://quiz.wykerd.io/api/${params.id}/details`)).json()))()
            .catch(e => { 
                console.error(e); 
                setError(e)
            });
    }, []);

    function handleGameData (data: any) {
        console.log(data);
        setGameData(data);
    }

    console.log(details);

    if (error) return <div>OOF looks like there was an error! Oh well go way now... (check console if you're interested in the message LOL)</div>;
    
    if (!details) return <div>Loading...</div>;

    if (!gameData) return <Identify data={details} onDone={handleGameData} />;

    if (gameData.done) return <EndScreen data={gameData} gameId={params.id} />;

    return <Quiz data={gameData} gameId={params.id} onDone={handleGameData} />;
}

export default Game;