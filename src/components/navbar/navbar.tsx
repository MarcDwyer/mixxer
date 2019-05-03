import React from 'react'
import { Link } from 'react-router-dom'

import './navbar-styles.scss'

interface IProps {
    changeTheme: Function;
    isWhite: any;
}

const Navbar = (props: IProps) => {
    return (
        <nav className="default-color">
            <Link className="logo" to="/">TwitchTube</Link>
            <div className="buttons">
                <i
                    className={`fas fa-toggle-${props.isWhite ? "on greenme" : "off"} default-button`}
                    onClick={() => props.changeTheme()}
                />
                <span>White theme?</span>
            </div>
        </nav>
    )
}

export default Navbar