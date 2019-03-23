import React from 'react'
import { LiveStreams } from '../Main/main'
import './card-styles.scss'

interface Props {
    streamer: LiveStreams;
}

const Card = (props: Props) => {
    const { streamer } = props
    return (
        <div className="card">
            <h4>{streamer.name}</h4>
            {streamer.isPlaying && (
                <span><small>playing {streamer.isPlaying}</small></span>
            )}
        </div>
    )    
}

export default Card