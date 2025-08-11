import React from 'react'
import {Link} from 'react-router'

const Navbar = () => {
    return (
        <nav className="navbar shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">RESUMIND</p>
            </Link>

            <Link to="/upload" className="primary-button w-fit">
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar
