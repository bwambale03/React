import React, {useContext} from 'react'
import {ThemeContext} from '../context/ThemeContext'
import {Link} from 'react-router-dom'
import {motion} from 'framer-motion'
import "../styles/NavBar.css"

const NavBar = () => {
  const {darkMode, setDarkMode} = useContext(ThemeContext);

  return (
    <motion.nav
      className='navbar'
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
        <ul>
            <motion.li whileHover={{scale: 1.1}}>
              <Link to="/">Home</Link>
            </motion.li>
            <motion.li whileHover={{scale: 1.1}}>
              <Link to="/about">About</Link>
            </motion.li>
            <motion.li whileHover={{scale: 1.1}}>
              <Link to="/services">Services</Link>
            </motion.li>
            <motion.li whileHover={{scale: 1.1}}>
              <Link to="/contact">Contact</Link>
            </motion.li>
        </ul>
        <button 
          onClick={()=>setDarkMode(!darkMode)}
          className='toggle-btn'
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>
    </motion.nav>
  )
}

export default NavBar
