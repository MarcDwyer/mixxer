import React from 'react'
import { AllStreams } from '../Main/main'
import { RouteComponentProps } from 'react-router-dom'
import './video-styles.scss'

import List from '../stream-list/list'

interface Props extends RouteComponentProps<{ id: string }> {
    live: AllStreams | null;
}
const Videoplayer = (props: Props) => {
    const { id } = props.match.params
    const newid = id.toLocaleLowerCase()
    const { live } = props
    if (!live) return null
    const stream = live[newid]
    const vidUrl: string = stream.type && stream.type === "youtube" ? `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp` : `https://player.twitch.tv/?channel=${stream.name}&muted=false`;
    const chatUrl: string = stream.type && stream.type === "youtube" ? `https://www.youtube.com/live_chat?v=${stream.videoId}&embed_domain=${window.location.hostname}` : `https://www.twitch.tv/embed/${stream.name}/chat?darkpopout`;
    return (
        <div className="video-parent">
            <List live={live} />
            <div className="video-player">
                <iframe src={vidUrl} frameBorder="0" />
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
                </div>
            </div>
            <div className="chat">
                <iframe src={chatUrl} frameBorder="0" />
            </div>
        </div>
    )
}

export default Videoplayer