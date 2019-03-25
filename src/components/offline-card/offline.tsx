import React from 'react'
import { LiveStreams } from '../Main/main'
import './offline-styles.scss'
interface Props {
    stream: LiveStreams;
}

const OfflineCard = (props: Props) => {
    const { stream } = props

    const image: string = stream.imageId.startsWith("https") ? stream.imageId : `https://s3.us-east-2.amazonaws.com/xhnetwork/${stream.imageId}`
    return (
        <div className="offline-card">
            <div className="off">
                <img src={image} alt="stream"/>
                <h3>{stream.name}</h3>
                <span>{stream.type}</span>
            </div>
        </div>
    )
}

export default OfflineCard