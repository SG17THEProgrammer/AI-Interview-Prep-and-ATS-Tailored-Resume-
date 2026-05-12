import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import toast from "react-hot-toast";



export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context


    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            console.log(data);
            if (data) {
                setUser(data.user)
                return {
                    success: true , 
                    message : data.message
                }
            }
            else {
                return {
                    success: false,
                    // message: "Feild is missing"
                }
            }
        } catch (err) {
            console.log(err)
            return {
                success: false,
                message: err.response.data.message || "Something went wrong"
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {

                const data = await getMe()
                // console.log(data);
                setUser(data.user)
            } catch (err) {
                if (err.response?.status === 401) {

                    toast.error(err.response.data.message)

                    setUser(null)
                }
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}