import React from 'react'
import { Link } from 'react-router-dom'

import './navbar-styles.scss'

const Navbar = () => {
    return (
        <nav>
            <Link className="logo" to="/">The Network</Link>
        </nav>
    )
}

export default Navbar