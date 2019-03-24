import React from 'react'
import { AllStreams } from '../Main/main'
import { Link } from 'react-router-dom'
import './list-styles.scss'
interface Props {
    live: AllStreams;
}
const List = (props: Props) => {
    const { live } = props
    const online = Object.values(live).filter(item => item.online)

    return (
        <div className="list-parent">
            <div className="list online">
                <h4>Online Channels</h4>
                {online.map((item, i) => {
                    const image: string = item.imageId.startsWith("https") ? item.imageId : `https://s3.us-east-2.amazonaws.com/xhnetwork/${item.imageId}`
                    return (
                        <Link to={`/${item.name}`} className="stream-list" key={item.channelId}>
                            <img src={image} alt="streamer" />
                            <div className="stream-info">
                                <span className="name">{item.name}</span>
                                <span className="isplaying">{item.isPlaying || "Just chatting"}</span>
                                <span className="viewer-count">{item.viewers} viewers</span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default List