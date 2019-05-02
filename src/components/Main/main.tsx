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
    isWhite: boolean;
}
class Main extends Component<{}, State> {
    constructor(props: {}) {
        super(props)

        let theme = localStorage.getItem("isDark")
        console.log(theme)
        this.state = {
            live: null,
            ws: new WebSocket(`ws://${document.location.hostname}:5000/sockets/`),
            isWhite: false
        }
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
                <Navbar changeTheme={this.changeTheme} />
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
    
    changeTheme = () => {
        this.setState({isWhite: !this.state.isWhite})
    }
    handleTheme = () => {
        const { isWhite } = this.state
        switch (isWhite) {
            case true:
            console.log('tru ran')
            document.documentElement.style.setProperty('--bgcolor', "#D6D6D6");
            document.documentElement.style.setProperty('--fontcolor', "black");
            document.documentElement.style.setProperty('--cardcolor', "#eee");
            break;
            case false:
            console.log("false ran")
            document.documentElement.style.setProperty('--bgcolor', "#16171b");
            document.documentElement.style.setProperty('--fontcolor', "rgba(255,255,255, .75)");
            document.documentElement.style.setProperty('--cardcolor', "rgba(37,37,46, 1)");
        }
    }
}

export default Main