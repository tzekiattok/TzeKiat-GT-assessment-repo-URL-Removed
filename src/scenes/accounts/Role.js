import { Groups } from "@mui/icons-material";
import React, {useState, useContext, useEffect} from "react";
import {AccountContext} from "./Account";
import {reactLocalStorage} from 'reactjs-localstorage';
const Role = () =>{
    const [status, setStatus] = useState(false);
    const [role,setRole] = useState();
    const {getSession} = useContext(AccountContext);
    
    useEffect(()=>
        {
            getSession().then(session =>{
                //session data -> session.idToken.payload
                //jwt token-> session.accessToken
                if(session.accessToken.payload['cognito:groups'].includes('Admin'))
                {
                    setRole('Admin');
                    reactLocalStorage.setObject('Role', {'role': 'Admin'})
                }
                else{
                    setRole('User');
                    reactLocalStorage.setObject('Role', {'role': 'User'})
                }
                setStatus(true);
            });
        },[]);
        return <p>{role}</p>;
    };

    
export default Role;