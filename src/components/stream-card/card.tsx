import React, { useState } from 'react'
import { LiveStreams } from '../Main/main'
import { Link } from 'react-router-dom'
import './card-styles.scss'

interface Props {
    streamer: LiveStreams;
}

const Card = (props: Props) => {
    const { streamer } = props

    const image: string = streamer.imageId.startsWith("https") ? streamer.imageId : `https://s3.us-east-2.amazonaws.com/xhnetwork/${streamer.imageId}`
    const vidUrl: string = streamer.type === "youtube" ? `https://www.youtube.com/embed/${streamer.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp` : `https://player.twitch.tv/?channel=${streamer.name}&muted=false`;
    const [hover, setHover] = useState<boolean>(false)

    const newtitle = streamer.title.slice(0, 28)
    console.log(streamer.description)
    return (
        <Link
            to={`/${streamer.name}`}
            className="card">
            {streamer && (
                <div className="captain"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                >
                    <div className="viewers">
                        <i className="fas fa-eye" />
                        <span>{streamer.viewers}</span>
                    </div>
                    <div className="image"
                    >
                        {!hover && (
                            <img src={streamer.thumbnails.high || streamer.thumbnails.low} alt="thumbnail" />
                        )}
                        {hover && (
                            <iframe src={vidUrl} frameBorder="0" />
                        )}
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