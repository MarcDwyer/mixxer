import React, { useState, useEffect } from 'react'
import { AllStreams, LiveStreams } from '../Main/main'
import './homepage.scss'

import OnlineCard from '../stream-card/card'
import Featured from '../featured/featured'
import OfflineCard from '../offline-card/offline'
import Footer from '../footer/footer'

interface Props {
    live: AllStreams | null;
}
const Homepage = (props: Props) => {
    const { live } = props
    if (!live) return null

    const online = Object.values(live).filter(item => item.online)
    const offline = Object.values(live).filter(item => !item.online).sort((a, b) => a.name > b.name ? 1 : -1)

    const [txt, setTxt] = useState<string>('')
    const [search, setSearch] = useState<LiveStreams[]>(online)

    useEffect(() => {
        const newTxt = txt.toLowerCase()
        const filtered = online.filter(item => item.name.includes(newTxt))
        setSearch(filtered)
    }, [txt])
    return (
        <div className="parent">
            <div className="container">
                <Featured live={live} />
                <div className="home-header">
                    <h2>Top Streams</h2>
                    <input
                        value={txt}
                        onChange={(e) => setTxt(e.target.value)}
                        placeholder="Search streamers"
                    />
                </div>
                <div className="card-grid">
                    {search.map((item) => {
                        return (
                            <OnlineCard key={item.channelId} streamer={item} />
                        )
                    })}
                </div>
                <h2>Offline Streams</h2>
                <div className="offline-grid">
                    {offline.map((item) => {
                        if (item.online) return
                        return (
                            <OfflineCard key={item.imageId} stream={item} />
                        )
                    })}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Homepage