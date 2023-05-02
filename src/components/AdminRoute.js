import React, { useState, useContext, useEffect } from "react";
import { useLocalState } from "../util/useLocalStorage.js";
import { Navigate, Outlet ,useNavigate} from "react-router-dom";
import { AccountContext } from "../scenes/accounts/Account";
import { CognitoUser, AuthenticationDetails } from "amazon-cognito-identity-js";
import Pool from "../UserPool";
import Authenticate from "./Auth";
import { reactLocalStorage } from 'reactjs-localstorage';


//children -> the values in e.g <PrivateRoute><xxx/><PrivateRoute>
//1. Check if user is authenticated
const AdminRoute = () => {
    const [role, setRole] = useState('');
    const { getSession } = useContext(AccountContext);
    const [hasSet, setHasSet] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {
        getSession().then(session => {
            //session data -> session.idToken.payload
            //jwt token-> session.accessToken
            setRole(session.accessToken.payload['cognito:groups'][0]);
            if(session.accessToken.payload['cognito:groups'].includes('Admin'))
            {
                setRole('Admin');
            }
            else{
                setRole('User')
            }
            //setRole(session.accessToken.payload['cognito:groups'][0]);

        });
    },[]);

    useEffect(()=>{
    },[role])

    if (role==="Admin"){
        return <Outlet/>
    }
    else if (role==="User"){
    return <Navigate to = "/resources"/>
    }
}
export default AdminRoute;