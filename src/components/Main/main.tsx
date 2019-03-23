import React, { Component } from 'react'
import Homepage from '../homepage/homepage'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
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
    selected: LiveStreams | null;
}
class Main extends Component<{}, State> {
    state = {
        live: null,
        ws: new WebSocket(`ws://${document.location.hostname}:5000/sockets/`),
        selected: null
    }
    componentDidMount() {
        const { ws } = this.state 
         
        ws.addEventListener('message', (msg) => {
            const payload = JSON.parse(msg.data)
            this.setState({live: payload})
        })
    }
    render() {
        const { live } = this.state
        return (
            <BrowserRouter>
                <Switch>
                    {live && (
                        <Route path="/" render={(props) => <Homepage {...props} live={this.state.live} /> } />
                    )}
                </Switch>
            </BrowserRouter>
        )
    }
}

export default Main