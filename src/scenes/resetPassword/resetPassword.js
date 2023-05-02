import React, { useState, useContext} from "react";
import { Link, useNavigate } from "react-router-dom";
import './resetPassword.css';
import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import Pool from "../../UserPool";
import {AccountContext} from "../accounts/Account";


const Signup = (props) => {
    const [stage, setStage] = useState(1); // 1 = email stage, 2 = code stage
        const [email, setEmail] = useState("");
        const [code, setCode] = useState("");
        const [password, setPassword] = useState("");
        const [confirmPassword, setConfirmPassword] = useState("");
        const [codeErr, setCodeErr] = useState("");
        let navigate = useNavigate();
        const getUser = () => {
          return new CognitoUser({
            Username: email.toLowerCase(),
            Pool
          });
        };

        const routeChangeLogin= () => {
            navigate('/');
        }

        const sendCode = event => {
          event.preventDefault();
          setCode('');
          var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
          if (validRegex.test(email)) {
            getUser().forgotPassword({
              onSuccess: data => {                
              },
              onFailure: err => {
                setCodeErr('Email is not registered with us. Please create an account.')
                console.error("verification code failed to send", err);
              },
              inputVerificationCode: data => {
                setCodeErr('');
                setStage(2);
              }
            });
          }
          else{
            setCodeErr("Must be a valid email address");
          }
          
          
        };
      
        const resetPassword = event => {
          event.preventDefault();
          setCode('');
          if (email ===""){
            navigate("/");
          }
          if (password !== confirmPassword) {
            setCodeErr('Password fields are not matching');
            console.error("Passwords are not the same");
            return;
          }
          const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ])[A-Za-z0-9^$*.[\]{}()?"!@#%&/\\,><':;|_~`=+\- ]{8,256}$/;
          if (!passRegex.test(password)){
            setCodeErr('Password need to contain at least 8 characters, one upper and one lower character with a special symbol e.g !');
            console.error("regex failed");
            return;
          
          }
      
          getUser().confirmPassword(code, password, {
            onSuccess: data => {
              alert('Successfully updated your password. Returning to login page')
              navigate("/");
            },
            onFailure: err => {
              setCodeErr('Invalid verification code. Please try again');
              console.error("failed to update password", err);
            }
          });
        };
        
        const sendVerification = () =>{
          setCodeErr('');
          setStage(1);
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
                <form className="login-form" onSubmit={sendCode}>
                    <h1 className="black-text">Reset Password</h1>
                    {codeErr !== '' &&<span className = "error_code">{codeErr}</span>}
                    <input type="email" className={"form-control "} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" id="email" name="email" />
                    <button type = "submit" className="signin-button" >Send verification code</button>
                    <button id="signUp" className="signup-button-mobile" onClick = {routeChangeLogin}>Back to login</button>

                    
                </form>
             )}
              {stage ===2 &&(
                <form className="login-form" onSubmit={resetPassword}>
                <h1 className="black-text">Reset Password</h1>
                <label htmlFor="verificationCode">Check your registered email for verification code</label>
                {codeErr !== '' &&<span className = "error_code">{codeErr}</span>}
                <input  value={code} onChange={event => setCode(event.target.value)} placeholder ="6 digit verification code"/>
                <input type="password" className={"form-control " } value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" id="password" name="password"/>
                <input type="password" className={"form-control " } value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm New Password" id="passwordNew" name="passwordNew"/>
                <button type="submit" className="signin-button">Change password</button>
                <button id="signUp" className="signup-button-mobile" onClick = {routeChangeLogin}>Back to login</button>
          </form>
        )}
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button className="ghost" id="signIn">Sign In</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Hello, Friend!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button id="signUp" className="signup-button" onClick = {routeChangeLogin}>Sign In</button>
                    </div>
                </div>
            </div>
        


        </div>
        
        <footer>
            <p>

            </p>
        </footer>
    </div>

);
}

export default Signup;