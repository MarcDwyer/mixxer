import React, { useState, useEffect } from 'react'
import { AllStreams, LiveStreams } from '../Main/main'
import './homepage.scss'

import Card from '../stream-card/card'
import Featured from '../featured/featured'
import OfflineCard from '../offline-card/offline'

interface Props {
    live: AllStreams | null;
}
const Homepage = (props: Props) => {
    const { live } = props
    if (!live) return null

    const online: LiveStreams[] = Object.values(live).filter(item => item.online)

    const [txt, setTxt] = useState<string>('')
    const [search, setSearch] = useState<LiveStreams[]>(online)


    useEffect(() => {
        const newTxt = txt.toLowerCase()
        const filtered = online.filter(item => item.name.includes(newTxt))
        setSearch(filtered)
    }, [txt])
    return (
        <div className="container">
            <Featured live={live} />
            <div className="home-header">
                <h2>Top Streams</h2>
                <input
                    value={txt}
                    onChange={(e) => setTxt(e.target.value)}
                    placeholder="Search online streams"
                />
            </div>
            <div className="card-grid">
                {live && search.map((item) => {
                    if (!item.online) return
                    return (
                        <Card key={item.channelId} streamer={item} />
                    )
                })}
            </div>
            <h2>Offline Streams</h2>
            <div className="offline-grid">
                {live && Object.values(live).map((item, i) => {
                    if (item.online) return
                    return (
                        <OfflineCard stream={item} />
                    )
                })}
            </div>
        </div>
    )
}

export default Homepage