import React, {useState, useContext, useEffect} from "react";
import {AccountContext} from "./Account";

const Status = () =>{
    const [status, setStatus] = useState(false);
    const [email,setEmail] = useState();
    const {getSession} = useContext(AccountContext);
    useEffect(()=>
        {
            getSession().then(session =>{
                //session data -> session.idToken.payload
                //jwt token-> session.accessToken
                setStatus(true);
                setEmail(session.idToken.payload.email)
            });
        },[]);
        return <div>{status ?email:"not logged in"}</div>;
    };
export default Status;