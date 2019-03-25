import React from 'react'
import { AllStreams } from '../Main/main'
import { Link } from 'react-router-dom'
import './featured-styles.scss'

interface Props {
    live: AllStreams;
}

const Featured = (props: Props) => {
    if (window.innerWidth < 1000) return null
    const online = Object.values(props.live).filter(item => item.online)

    const featuredStream = online[0]

    const vidUrl: string = featuredStream.type && featuredStream.type === "youtube" ? `https://www.youtube.com/embed/${featuredStream.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp` : `https://player.twitch.tv/?channel=${featuredStream.name}&muted=false`;
    return (
        <Link className="featured-div"
        to={`/${featuredStream.name}`}
        >
            <div className="iframe-div">
                <iframe src={vidUrl} frameBorder="0" />
            </div>
            <div className="featured-info">
                <h3>{featuredStream.title}</h3>
                <span>{featuredStream.displayName || featuredStream.name}</span>
            </div>
        </Link>
    )
}

export default Featured