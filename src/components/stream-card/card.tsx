import React from 'react'
import { LiveStreams } from '../Main/main'
import { Link } from 'react-router-dom'
import './card-styles.scss'

interface Props {
    streamer: LiveStreams;
}

const Card = (props: Props) => {
    const { streamer } = props

    const image: string = streamer.imageId.startsWith("https") ? streamer.imageId : `https://s3.us-east-2.amazonaws.com/xhnetwork/${streamer.imageId}`

    const newtitle = streamer.title.slice(0, 28)
    console.log(props)
    return (
        <Link 
        to={`/${streamer.name}`}
        className="card">
            {streamer.isPlaying && (
                <div className="captain">
                    <div className="image">
                        <img src={streamer.thumbnails.high || streamer.thumbnails.low} alt="thumbnail" />
                    </div>
                    <div className="streamer-info">
                        <img src={image} alt="streamer" />
                        <div className="info">
                            <span className="title">{newtitle + '...'}</span>
                            <span>{streamer.displayName || streamer.name}</span>
                            <span>{streamer.isPlaying || ""}</span>
                        </div>
                    </div>
                </div>
            )}
        </Link>
    )
}

export default Card