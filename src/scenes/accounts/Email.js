import React, {useState, useContext, useEffect} from "react";
import {AccountContext} from "./Account";
//temp sln for retrieving email
const Email = () =>{
    const [status, setStatus] = useState(false);
    const [email,setEmail] = useState();
    const {getSession,logout} = useContext(AccountContext);
    useEffect(()=>
        {
            getSession().then(session =>{
                //session data -> session.idToken.payload
                //email_verified-> session.idToken.payload.email_verified
                setStatus(true);
                setEmail(session.idToken.payload.email);
                
            });
        },[]);
    
        return <div>{email}</div>;
    };
export default Email;