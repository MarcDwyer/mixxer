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
    isWhite: any;
}
class Main extends Component<{}, State> {
    constructor(props: {}) {
        super(props)

        let theme = localStorage.getItem("isWhite")
        if (theme) {
            theme = JSON.parse(theme)
        }
        this.state = {
            live: null,
            ws: new WebSocket(`wss://${document.location.host}/sockets/`),
            isWhite: theme
        }
    }
    componentDidMount() {
        const { ws, isWhite } = this.state
        ws.addEventListener('message', (msg) => {
            const payload: LiveStreams[] = JSON.parse(msg.data)
            if (!payload) return
            const newPayload: AllStreams = payload.reduce((obj: AllStreams, item) => {
                obj[item.name.toLowerCase()] = item
                return obj
            }, {})
            this.setState({ live: newPayload })
        })
        if (isWhite) this.handleTheme()
    }
    componentDidUpdate(prevProps: {}, prevState: State) {
        const { isWhite } = this.state
        if (prevState.isWhite !== isWhite) {
            localStorage.setItem("isWhite", JSON.stringify(isWhite))
            this.handleTheme()

        }
    }
    render() {
        const { live } = this.state 
        return (
            <BrowserRouter>
                <Navbar changeTheme={this.changeTheme} isWhite={this.state.isWhite} />
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
                        <Route path="/:id" render={(props) => <Videoplayer {...props} live={this.state.live} isWhite={this.state.isWhite} />} />
                        <Route path="/" render={(props) => <Homepage {...props} live={this.state.live} />} />
                    </Switch>
                )}
            </BrowserRouter>
        )
    }
    
    changeTheme = () => {
        this.setState({isWhite: !this.state.isWhite}, () => {
            this.handleTheme()
        })
    }
    handleTheme = () => {
        const { isWhite } = this.state
        switch (isWhite) {
            case true:
            document.documentElement.style.setProperty('--bgcolor', "#D6D6D6");
            document.documentElement.style.setProperty('--fontcolor', "black");
            document.documentElement.style.setProperty('--cardcolor', "#eee");
            document.documentElement.style.setProperty('--hovercolor', "white");
            break;
            case false:
            document.documentElement.style.setProperty('--bgcolor', "#16171b");
            document.documentElement.style.setProperty('--fontcolor', "rgba(255,255,255, 1)");
            document.documentElement.style.setProperty('--cardcolor', "rgba(37,37,46, 1)");
            document.documentElement.style.setProperty('--hovercolor', "rgba(55, 65, 80, .45)");
        }
    }
}

export default Main