import React from 'react'
import './footer-styles.scss'

const Footer = () => {
    return (
        <div className="footer default-color">
            <div className="itsme">
                <span>Created by Marc Dwyer</span>
                <a target="_blank" href="https://github.com/MarcDwyer">
                    <i className="fab fa-github" />
                </a>
            </div>
        </div>
    )
}

export default Footer