import React from 'react'
import { AllStreams } from '../Main/main'
import Card from '../stream-card/card'
import './homepage.scss'
interface Props {
     live: AllStreams | null;
}
const Homepage = (props: Props) => {
    const { live } = props
    console.log(live)
    return (
        <div className="container">
            <h2>Top Streams</h2>
            <div className="card-grid">
            {live && Object.values(live).map((item) => (
                    <Card key={item.channelId} streamer={item} />
                ))}
            </div>
        </div>
    )
}

export default Homepage