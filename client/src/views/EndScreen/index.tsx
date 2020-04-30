import React from 'react';
import './index.css';

const EndScreen: React.FC<{data: any; gameId: string}> = ({ data }) => {
    return <div id="endscreen">
        <h1>{data.message}</h1>
        <h2>Your score is {data.score} / 300</h2>
    </div>
}

export default EndScreen;