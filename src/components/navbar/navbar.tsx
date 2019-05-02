import React from 'react'
import { Link } from 'react-router-dom'

import './navbar-styles.scss'

interface IProps {
    changeTheme: Function;
}

const Navbar = (props: IProps) => {
    return (
        <nav className="default-color">
            <Link className="logo" to="/">TwitchTube</Link>
            <button
            onClick={() => props.changeTheme()}
            >Change Theme</button>
        </nav>
    )
}

export default Navbar