import React from 'react'
import "./styles/index.css"
import AppRouter from './Router'
import ThemeContextProvider from './context/ThemeContext'

const App = () => {
  return (
    <ThemeContextProvider>
      <AppRouter />
    </ThemeContextProvider>
  )
}

export default App
