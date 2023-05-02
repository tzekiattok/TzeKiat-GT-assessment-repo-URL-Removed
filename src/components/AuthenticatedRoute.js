import React, {useState, useContext, useEffect} from "react";
import {useLocalState} from "../util/useLocalStorage.js";
import {Navigate,Outlet} from "react-router-dom";
import {AccountContext} from "../scenes/accounts/Account";
import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import Auth from "./Auth";
import {reactLocalStorage} from 'reactjs-localstorage';
//Reroute authenticated users from signin or login page to landing page
const AuthenticatedRoute =() =>{
    const [load,setload] = useState(()=>{
        return reactLocalStorage.getObject('Auth').logged
    });
    useEffect(() => {
        if (load === false ){
    }
    }, [load]);
    useEffect(() => {
        if (load === undefined ){
            reactLocalStorage.setObject('Auth', {'logged': false})
    }
    }, [load]);
    
    if (load === false){
        return <Outlet/>
    }
    else{
        return <Navigate to = "/UserDashboard"/>
    }
};

export default AuthenticatedRoute;