import { createContext, useEffect, useState } from "react";
import { makeRequest } from '../axios'


export const AuthContext = createContext()
export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)

    const Login = async (inputs) => {
        try {
            const res = await makeRequest.post('/auth/login', inputs)
            setUser(JSON.stringify(res.data.user))
            return [res.data.message, res.data.success]

        } catch (error) {
            return [error.response.data.message, error.response.data.success]
        }
    }

    const Logout = async () => {
        setUser(null)
        await makeRequest.get('/auth/logout')
    }

    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(user))
    }, [user])


    return (
        <AuthContext.Provider value={{ Login, user, Logout }}>
            {children}
        </AuthContext.Provider>
    )
}