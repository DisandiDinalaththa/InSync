import { useEffect, useContext, useState, createContext } from "react";
import { auth, db } from "../firebaseConfig";
import { onAuthStateChanged, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";


export const AuthContext = createContext (null);  //creating the context for authentication.

export const AuthContextProvider = ({children}) => {
    const [user, setUser] = useState (null)   //state variable to store user
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);  //to check if user is authenticated or information.

    useEffect (() => {
       const unsub = onAuthStateChanged (auth, (user)=>{
            //console.log('got user:  ', user);
            if (user){
                setIsAuthenticated(true);
                setUser(user);
                updateUserData(user.uid);
            }else{
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unsub;
    }, []);

    const updateUserData = async (userId) =>{
        const docRef = doc(db,'users', userId);
        const docSnap = await getDoc (docRef);
        
        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser({...user, username: data.username, userId: data.userId})
        }
    }
        

    const login = async (email, password) => {
        try{
            const response = await signInWithEmailAndPassword(auth, email, password);
            return{success: true};
        }catch (e){
            let msg= e.message;
            if(msg.includes('(auth/invalid-email)')) msg='Invalid e-mail!'
            if(msg.includes('(auth/invalid-credential)')) msg='Wrong Credentials!'
            return {success: false, msg};
        }
    }
    const logout = async () => {
        try{
           await signOut(auth);
           return {success: true} 

        }catch (e){
            return{success: false, msg: e.message, error: e};
        }
    }

    const register = async (email, password, username) => {
        try{
            const response = await createUserWithEmailAndPassword (auth, email, password);
            console.log ('response.user :', response?.user);

            await setDoc (doc (db, "users", response?.user?.uid), {
                username,
                userId: response?.user?.uid
            });
            return {success: true, data: response?.user};
        }catch (e){
            let msg= e.message;
            if(msg.includes('(auth/invalid-email)')) msg='Invalid e-mail!'
            if(msg.includes('(auth/email-already-in-use)')) msg='This e-mail is already in use! '
            return {success: false, msg};
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