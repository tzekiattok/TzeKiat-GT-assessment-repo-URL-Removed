import React, { useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import './signup.css';
import UserPool from "../../UserPool";
import {
    AuthenticationDetails,
    CognitoUser,
    CognitoUserPool,
    CognitoUserAttribute,
    
  } from 'amazon-cognito-identity-js';


const Signup = (props) => {
    const [stage, setStage] = useState(1); // 1 = email stage, 2 = code stage
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [pass2, setPass2] = useState('');
    const [emailErr, setEmailErr] = useState('');
    const [passErr, setPassErr] = useState('');
    const [cognitoErr, setCognitoErr] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [confirmationCodeErr, setConfirmationCodeErr] = useState('');
    let navigate = useNavigate();
    //test
    const routeChangeLogin= () => {
        navigate('/');
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        //trim and lower case email
        setEmail(email.toLowerCase().trim());
        const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,256}$/;
        //validation reset
        setEmailErr('');
        setCognitoErr('');
        setPassErr('');
        setConfirmationCodeErr('')
        //validation 1: email must not be empty
        if (email.length ===0){
            setEmailErr('Email required');
            return;
        }
        if (pass.length ===0 || pass2.length ===0)
        {
            setPassErr('Password text field cannot be empty');
            return;
        }
        if (pass !== pass2 && pass.length >0)
        {
            setPassErr('Password and Confirm Password does not match');
            return;
        }
        if (!passRegex.test(pass)){
            setPassErr('Password need to contain at least 8 characters, one upper and one lower character with a special symbol e.g !');
            return;
        }
       
        UserPool.signUp(email,pass, [], null, (err,data) =>
        {
            if (err){
                let errormsg = String(err);
                let [first,...rest] = errormsg.split(':');
                rest = rest.join(':');
                setCognitoErr('We encountered an issue signing up, please contact the administrator for more information');
                //for more specific displays
                //setCognitoErr('We encountered an issue signing up: '+String(rest));
            }
            else{
            setStage(2);
            //redirect login page
            //navigate("/");
            }
        });
           
    }

    const verifyAccount = (e)=> {
        e.preventDefault();
        setConfirmationCode( confirmationCode.trim());
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: UserPool
           });
           return new Promise((resolve, reject) => {
            cognitoUser.confirmRegistration(confirmationCode, true, function (err, result) {
             if (err) {
              setConfirmationCodeErr('Invalid verification code');
              reject(err);
             } else {
                
              resolve(result);
              alert('Successfully verified, returning to login page')
              navigate('/')
             }
            });
           });
          }
    return (
        <div className="login">
        <div className="container" id="container">
                    
      
            <div className="form-container sign-up-container">
                <form>
                    <h1>Create Account</h1>
                    <div className="social-container">
                        <h2 className="black-text">WISE Portal</h2>
                    </div>
                    <span>or use your email for registration</span>
                    <input type="text" placeholder="Name" />
                    <input type="email" placeholder="Email" />
                    <input type="password" placeholder="Password" />
                    <button >Sign Up</button>
                </form>
            </div>
            <div className="form-container sign-in-container">
            {stage ===1 &&(
                <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="black-text">Register</h1>
                    {emailErr !== '' &&<span className = "error_code">{emailErr}</span>}
                    {passErr !== '' &&<span className = "error_code">{passErr}</span>}
                    {cognitoErr !== '' &&<span className = "error_code">{cognitoErr}</span>}
                    <input type="email" className={"form-control "} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" id="email" name="email" />
                    <input type="password" className={"form-control " } value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Password" id="password" name="password"/>
                    <input type="password" className={"form-control " } value={pass2} onChange={(e) => setPass2(e.target.value)} placeholder="Confirm Password" id="password2" name="password2"/>
                    <button type = "submit" className="signin-button" >Get verification link</button>
                    <button id="signUp" className="signup-button-mobile" onClick = {routeChangeLogin}>Back to login</button>

                </form>
             )}
              {stage ===2 &&(
                <form className="login-form" onSubmit={verifyAccount}>
                
               <h1 className="black-text">Check your email for the verification link</h1>
                {/*
                <h1 className="black-text">Verify your email</h1>
                {confirmationCodeErr !== '' &&<span className = "error_code">{confirmationCodeErr}</span>}
                <label htmlFor="verificationCode">{confirmationCodeErr}</label>
                <input type="text" className="max-len" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} placeholder="6 digit confirmation code" id="confirmationCode" name="confirmationCode" />*/}
                
          </form>
        )}
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Almost done!</h1>
                        <p>After accepting the verification link, your account is ready! </p>
                        <button className="ghost" id="signIn">Sign In</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Already registered?</h1>
                        <p>Click below to sign in</p>
                        <button id="signUp" className="signup-button" onClick = {routeChangeLogin}>Sign In</button>
                    </div>
                </div>
            </div>
        


        </div>
        
    </div>

);
}

export default Signup;