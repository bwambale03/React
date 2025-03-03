import React, {useState} from 'react'
import "./../styles/Footer.css"
import ChatBotComponent from './Chatbot'
import { div, span } from 'framer-motion/client'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState(false)

  const validateEmail = (email) => {
    if (!email.trim()){
      setError('Email is required')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)){
      setError('please enter a valid mail')
      return false
    }
    setError('')
    return true

  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateEmail(email)){
      console.log('subscribe with: ',email);
      setSubscribed(true)
      setEmail('')
      setTimeout(() => {
        setSubscribed(false)
      }, 3000)
    }
  }

  return (
    <div>
        <div className='footer'>
          <div>
            <div className='footer__container'></div>
              <div className='footer__row'>
                <div className='footer__col'>
                  <h4>Company</h4>
                  <ul>
                    <li><a href='#'>About Us</a></li>
                    <li><a href='#'>Careers</a></li>
                    <li><a href='#'>Contact Us</a></li>
                  </ul>
                </div>
                <div className='footer__col'>
                  <h4>Services</h4>
                  <ul>
                    <li><a href='#'>Web Design</a></li>
                    <li><a href='#'>Web Development</a></li>
                    <li><a href='#'>SEO</a></li>
                  </ul>
                </div>
                <div className='footer__col'>
                  <h4>Legal</h4>
                  <ul>
                    <li><a href='#'>Privacy Policy</a></li>
                    <li><a href='#'>Terms of Use</a></li>
                  </ul>
                </div>
                <div className='footer__col'>
                  <h4>Newsletter</h4>
                  <div className='footer__newsletter'>
                    <p>Subscribe to our newsletter to get the latest updates</p>
                    <form onSubmit={handleSubmit}>
                      <input 
                        type='email' 
                        placeholder='Enter your email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                      />
                      {error && <span className='error'>{error}</span>}
                      {subscribed && <span className='success'>Subscribed successfully!</span>}
                      <button type='submit'>Subscribe</button>
                    </form>
                  </div>
                </div>
                <div className='footer__col'>
                  <h4>Follow Us</h4>
                  <div className='footer__social-links'>
                    <a href='https://www.facebook.com/inetworks.ltd'><i className='fab fa-facebook-f'></i></a>
                    <a href='https://x.com/kambaleedwin'><i className='fab fa-twitter'></i></a>
                    <a href='https://www.instagram.com/inetworks.ltd'><i className='fab fa-instagram'></i></a>
                    <a href='https://www.linkedin.com/in/edwinkambale/'><i className='fab fa-linkedin-in'></i></a>
                  </div>
                </div>
              </div>
              <hr className='footer__hr'/>
            <div>
              <p>© {new Date().getFullYear()} Inetworks Ltd. All rights reserved.</p>
            </div>
            </div>
        </div>
        <ChatBotComponent />
    </div>
  )
}

export default Footer
