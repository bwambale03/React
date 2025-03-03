import React, {createContext, useState, useEffect} from 'react'

export const ThemeContext = createContext();

const ThemeContextProvider = ({children}) => {
    const [darkMode, setDarkMode] = useState(()=>{
        const localData = localStorage.getItem('darkMode');
        return localData ? JSON.parse(localData) : false;
    });
    useEffect(()=>{
        document.body.classList.toggle("dark-mode", darkMode);
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);
    return (
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider
