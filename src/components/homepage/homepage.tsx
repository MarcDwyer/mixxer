import React from 'react'
import { AllStreams } from '../Main/main'
import './homepage.scss'

import Card from '../stream-card/card'
import Featured from '../featured/featured'
interface Props {
     live: AllStreams | null;
}
const Homepage = (props: Props) => {
    const { live } = props
    if (!live) return null
    return (
        <div className="container">
        <Featured live={live} />
            <h2>Top Streams</h2>
            <div className="card-grid">
            {live && Object.values(live).map((item) => {
                if (!item.online) return
                    return (
                        <Card key={item.channelId} streamer={item} />
                    )
            })}
            </div>
        </div>
    )
}

export default Homepage