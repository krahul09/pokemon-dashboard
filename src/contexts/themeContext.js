const { createContext, useState, useEffect, useContext } = require("react");



const themeContext = createContext();


export const ThemeProvider = ({children}) => {
    const [theme, setTheme] = useState("light");



useEffect(()=> {
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(theme)
},[theme])


const lightTheme = () => {
    setTheme("light")
  }

  const darkTheme = () => {
    setTheme("dark")
  }


return (
    <themeContext.Provider value={{theme, lightTheme, darkTheme}}>
        {children}
    </themeContext.Provider>
);
};


export const useTheme = () => useContext(themeContext);