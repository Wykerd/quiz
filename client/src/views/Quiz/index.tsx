import React, { useState } from 'react';
import './index.css';
import { IdentifyProps } from '../Identify';

export interface QuizProps extends IdentifyProps {
    gameId: string;
}

const Quiz: React.FC<QuizProps> = ({ data, onDone, gameId }) => {
    const [ error, setError ] = useState<any>(false);
    const [ val, setVal ] = useState<string>('');

    async function handleSubmit(op : string) {
        try {
            setVal('');
            onDone(await (await fetch(`http://quiz.wykerd.io/api/${gameId}/submit`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ans: op})
            })).json());
        } catch (error) {
            setError(error);
        }
    }

    if (error) return <div>Error: {JSON.stringify(error)}</div>

    return <div id="quiz">
        <header>
            { data.question.question }
            <section>
                Score: { data.score } <br/>
                Progress: { Math.floor(data.progress * 100) }%
            </section>
        </header>
        <main>
            {
                data?.question?.options?.length ? data.question.options.map((op : string, i: number) => <button onClick={()=>handleSubmit(op)} key={i}>{op}</button>) : <>
                    <input type="text" value={val} onChange={e => setVal(e.target.value)} placeholder="Your Answer" />
                    <button onClick={()=>handleSubmit(val)}>Submit</button>
                </>
            }
            <div id="placeholder"/>
        </main>
    </div>
}

export default Quiz;