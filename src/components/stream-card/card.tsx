import React from 'react'
import { LiveStreams } from '../Main/main'
import { Link } from 'react-router-dom'
import './card-styles.scss'

interface Props {
    streamer: LiveStreams;
}

interface ParentProps {
    streamer: LiveStreams;
    children: any;
}
const ParentDiv = (props: ParentProps): JSX.Element => {
    if (window.innerWidth < 1250 && props.streamer.type === "youtube") {
        return (
            <a
                href={`https://www.youtube.com/watch?v=${props.streamer.videoId}`}
                className="card"
            >
                {props.children}
            </a>
        )
    } else {
        return (
            <Link
                to={`/${props.streamer.name}`}
                className="card default-color"
            >
                {props.children}
            </Link>
        )
    }
}
const Card = (props: Props) => {
    const { streamer } = props
    const image: string = streamer.imageId.startsWith("https") ? streamer.imageId : `https://s3.us-east-2.amazonaws.com/xhnetwork/${streamer.imageId}`

    const newtitle = streamer.title.slice(0, 28)
    return (
        <ParentDiv
            streamer={streamer}
        >
            <div className="captain"
            >
                <div className="viewers">
                    <i className="fas fa-eye" />
                    <span>{streamer.viewers}</span>
                </div>
                <div className="image"
                >
                    <img src={streamer.thumbnails.high || streamer.thumbnails.low} alt="thumbnail" />
                </div>
                <div className="streamer-info">
                    <img src={image} alt="streamer" />
                    <div className="info">
                        <span className="title">{newtitle + '...'}</span>
                        <span>{streamer.displayName || streamer.name}</span>
                        <span>{streamer.isPlaying || "Just Chatting"}</span>
                    </div>
                </div>
            </div>
        </ParentDiv>
    )
}

export default Card