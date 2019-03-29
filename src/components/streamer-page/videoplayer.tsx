import React, { useEffect, useRef } from 'react'
import { AllStreams, LiveStreams } from '../Main/main'
import { RouteComponentProps } from 'react-router-dom'
import './video-styles.scss'

import List from '../stream-list/list'

interface Props extends RouteComponentProps<{ id: string }> {
    live: AllStreams | null;
    offline: LiveStreams[] | null;
}
const Videoplayer = React.memo((props: Props) => {
    const { id } = props.match.params
    const newid = id.toLocaleLowerCase()
    const { live, offline } = props
    if (!live) return null
    const stream = live[newid]
    if (!stream) {
        props.history.push("/")
        return null
    }
    useEffect(() => {
        document.body.style.overflow = 'hidden'

        return (() => {
            document.body.style.overflow = 'auto'
        })
    }, [])
    const description = useRef<HTMLParagraphElement | null>(null)
    console.log(description)
    const vidUrl: string = stream.type && stream.type === "youtube" ? `https://www.youtube.com/embed/${stream.videoId}?autoplay=1&amp;showinfo=0&amp;modestbranding=1&amp;enablejsapi=1&amp` : `https://player.twitch.tv/?channel=${stream.name}&muted=false`;
    const chatUrl: string = stream.type && stream.type === "youtube" ? `https://www.youtube.com/live_chat?v=${stream.videoId}&embed_domain=${window.location.hostname}` : `https://www.twitch.tv/embed/${stream.name}/chat?darkpopout`;
    return (
        <div className="video-parent" >
            <List live={live} offline={offline} />
            <div className="video-player" style={description.current ? {height: `${description.current.clientHeight + 65}px`} : {}}>
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
                            <p ref={description} >{stream.description} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Similique quae soluta quidem exercitationem dolorum sed ducimus repellendus. Tempora a officiis minus repellendus, voluptatibus doloribus? Fuga, eos. Obcaecati natus iusto delectus ut placeat eaque. Porro perferendis dolore consequatur, dicta ullam expedita non et sequi temporibus beatae? Iure qui sunt pariatur excepturi totam nisi eaque expedita quidem impedit asperiores beatae dicta, id esse tempora omnis quas corporis minus aliquid et aliquam deleniti cumque ducimus nesciunt mollitia! Accusamus enim quibusdam eius, possimus aspernatur ab natus dolorum animi quisquam cum architecto, error optio dolorem doloremque, ducimus atque esse! Possimus soluta culpa placeat expedita ullam.</p>
                    </div>
                </div>
            </div>
            <div className="chat">
                <iframe src={chatUrl} frameBorder="0" />
            </div>
        </div>
    )
})

export default Videoplayer