import { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { createContext } from "react";




export const AuthContext = createContext (null);  //creating the context for authentication.

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState (null)   //state variable to store user
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);  //to check if user is authenticated or information.

    useEffect (() => {
        //onAuthStateChanged

        setTimeout(()=>{
            setIsAuthenticated (false);
        }, 4000);
    }, [])

    const login = async (email, password) => {
        try{

        }catch (e){

        }
    }
    const logout = async () => {
        try{

        }catch (e){
            
        }
    }
    const register = async (email, password, username, profileUrl) => {
        try{

        }catch (e){
            
        }
    }

    return (
        <AuthContext.Provider value={{user, isAuthenticated, login, logout, register}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = ()=> {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth must be used within the AuthProvider');
    }

    return value;
}