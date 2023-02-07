import { createContext, useEffect, useState } from "react";

export const DarkModeContext = createContext()

export const DarkModeContextProvider = ({ children }) => {


    const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkMode')) || "dark")

    const ToggleDarkMode = () => {
        if (darkMode === "dark") {
            setDarkMode("white")
            return;
        }
        setDarkMode("dark")
    }


    useEffect(() => {
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode])

    return (
        <DarkModeContext.Provider value={{ darkMode, ToggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    )
}