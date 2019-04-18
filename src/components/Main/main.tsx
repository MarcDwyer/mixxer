import React, { Component } from 'react'
import Homepage from '../homepage/homepage'
import Videoplayer from '../streamer-page/videoplayer'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { BounceLoader } from 'react-spinners';

import Navbar from '../navbar/navbar'

import './main-styles.scss'
export interface LiveStreams {
    title: string;
    name: string;
    channelId: string;
    description: string;
    imageId: string;
    likes: string | null;
    dislikes: string | null;
    viewers: number;
    videoId: string | null;
    thumbnails: Thumbnail;
    displayName: string | null;
    isPlaying: string | null;
    Mature: boolean | null;
    online: boolean;
    type: string;
}
interface Thumbnail {
    high: string;
    low: string;
}
export interface AllStreams {
    [id: string]: LiveStreams;
}
interface State {
    live: AllStreams | null;
    ws: WebSocket;
}
class Main extends Component<{}, State> {
    state = {
        live: null,
        ws: new WebSocket(`wss://${document.location.host}/sockets/`)
    }
    componentDidMount() {
        const { ws } = this.state

        ws.addEventListener('message', (msg) => {
            const payload: LiveStreams[] = JSON.parse(msg.data)
            if (!payload) return
            const newPayload: AllStreams = payload.reduce((obj: AllStreams, item) => {
                obj[item.name.toLowerCase()] = item
                return obj
            }, {})
            this.setState({ live: newPayload })
        })
    }
    render() {
        const { live } = this.state 
        return (
            <BrowserRouter>
                <Navbar />
                {!live && (
                    <div className="container container-loader">
                        <BounceLoader
                            sizeUnit={"px"}
                            size={125}
                            color={'#123abc'}

                        />
                    </div>
                )}
                {live && (
                    <Switch>
                        <Route path="/:id" render={(props) => <Videoplayer {...props} live={this.state.live} />} />
                        <Route path="/" render={(props) => <Homepage {...props} live={this.state.live} />} />
                    </Switch>
                )}
            </BrowserRouter>
        )
    }
}

export default Main