import React, { useEffect, useRef } from 'react'
import { AllStreams } from '../Main/main'
import { RouteComponentProps } from 'react-router-dom'
import './video-styles.scss'

import List from '../stream-list/list'

interface Props extends RouteComponentProps<{ id: string }> {
    live: AllStreams | null;
    isWhite: any;
}
const Videoplayer = (props: Props) => {
    const { id } = props.match.params
    const newid = id.toLocaleLowerCase()
    const { live } = props
    if (!live) return null
    const stream = live[newid]
    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return (() => {
            document.body.style.overflow = 'auto'
        })
    }, [])
    const description = useRef<HTMLParagraphElement | null>(null)
    const vidUrl: string = stream.type && stream.type === "youtube" ? `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp` : `https://player.twitch.tv/?channel=${stream.name}&muted=false`;
    const chatUrl: string = stream.type && stream.type === "youtube" ? `https://www.youtube.com/live_chat?v=${stream.videoId}&embed_domain=${window.location.hostname}` : `https://www.twitch.tv/embed/${stream.name}/chat${props.isWhite ? "" : "?darkpopout"}`;
    return (
        <div className="video-parent" >
            <List live={live} />
            <div className="video-player" style={description.current && window.innerWidth > 1250 ? { height: `${description.current.clientHeight + 65}px` } : { height: '100%' }}>
                <iframe src={vidUrl} frameBorder="0" allowFullScreen={true} />
                <div className="details">
                    <div className="stream-title">
                        <h3>{stream.title}</h3>
                        <span><i className="fas fa-eye" /> {stream.viewers} viewers</span>
                    </div>
                    <div className="stream-info">
                        <span className="isPlaying">{(() => {
                            if (!stream.online) {
                                return `${stream.name} is offline`
                            } else {
                                return `${stream.displayName || stream.name} is playing ${stream.isPlaying || "Just Chatting"}`
                            }
                        })()}</span>
                        <p ref={description} >{stream.description}</p>
                    </div>
                </div>
            </div>
            <div className="chat">
                <iframe src={chatUrl} frameBorder="0" />
            </div>
        </div>
    )
}

export default Videoplayer