import React, {useState, useContext, useEffect} from "react";
import {useLocalState} from "../util/useLocalStorage.js";
import {Navigate,Outlet} from "react-router-dom";
import {AccountContext} from "../scenes/accounts/Account";
import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import Authenticate from "./Auth";
import {reactLocalStorage} from 'reactjs-localstorage';
import jwt_decode from "jwt-decode";


//children -> the values in e.g <PrivateRoute><xxx/><PrivateRoute>
//1. Check if user is authenticated

const PrivateRoute =() =>{
    const { getSession,logout } = useContext(AccountContext);
    getSession().then(session =>{
        reactLocalStorage.setObject('jwt', {'jwt': session.accessToken.jwtToken})
        if (jwt_decode(reactLocalStorage.getObject('jwt').jwt).exp *1000 <Date.now()){
            logout()
        }
    });
    //const [jwt, setJwt] = useLocalState("","jwt");
    const [load,setload] = useState(()=>{
        return reactLocalStorage.getObject('Auth').logged
    });
   
    useEffect(() => {
        if (load === undefined ){
            setload(false);
            reactLocalStorage.setObject('Auth', {'logged': false})
            /*return () => { 
                reactLocalStorage.getObject('Auth').logged ? <Outlet/>:<Navigate to = "/"/>;
        }*/
    }
    }, [load]);
    
    useEffect(() => {
        if (load === true){
            /*return () => { 
                reactLocalStorage.getObject('Auth').logged ? <Outlet/>:<Navigate to = "/"/>;
        }*/
    }
    }, [load]);

    useEffect(() => {
        if (load === undefined ){
            reactLocalStorage.setObject('Auth', {'logged': false})
            /*return () => { 
                reactLocalStorage.getObject('Auth').logged ? <Outlet/>:<Navigate to = "/"/>;
        }*/
    }
    }, [load]);
    
    if (load === true){
        //return reactLocalStorage.getObject('Auth').logged ? <Outlet/>:<Navigate to = "/"/>;
        return <Outlet/>
    }
    else{
        return <Navigate to = "/"/>
    }

    

};

export default PrivateRoute;