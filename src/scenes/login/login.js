import React, { useState, useContext, useEffect } from "react";
import './login.css';
import { useNavigate, Link } from "react-router-dom";
import { Hub, Auth } from 'aws-amplify';
import { CognitoUser, AuthenticationDetails, CognitoUserSession } from "amazon-cognito-identity-js";
import Pool from "../../UserPool"
import { AccountContext } from "../accounts/Account"
import { reactLocalStorage } from 'reactjs-localstorage';
import Authenticate from "../../components/Auth";
import { maxHeight } from "@mui/system";

const Login = (props) => {
    const [rightOverlay,setRightOverlay] = useState(true);//Configure the animation state
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const { authenticate,getSession } = useContext(AccountContext);
    const [error, setError] = useState('');

    //set animation state
    const animationStateSignUpFormRight = () =>{
        setRightOverlay(false);
    }
    const animationStateSignUpFormLeft = () =>{
        setRightOverlay(true);
    }



    let navigate = useNavigate();
    //Authentication handle
    const handleSubmit = (e) => {
        e.preventDefault();
        //user session
        authenticate(email, pass).then(
            data => {
            })
            .catch(err => {
                setError('Incorrect username or password');
            })
    }

    //Register redirect
    const routeChangeRegister = () => {
        let path = '/signup';
        navigate(path);
    }

    const routeChangeForgotPassword = () => {
        let path = '/resetPassword';
        navigate(path);
    }
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // get user
    async function getUser() {
        //You want it to only run if the user is not logged, and only once
        const token = await Auth.currentAuthenticatedUser();
        setLoading(true);
        setUser(token);
        //get token after authenticating with Google SSO to verify session with cognito
        const sessionData = {
            IdToken: token.signInUserSession.idToken,
            AccessToken: token.signInUserSession.accessToken,
            RefreshToken: token.signInUserSession.refreshToken,
            ClockDrift: token.signInUserSession.clockDrift,
        }
        const Username = token.attributes.email;
        const cognitoUser = new CognitoUser({
            Username,
            Pool,
        });
        const userSession = new CognitoUserSession(sessionData);
        cognitoUser.setSignInUserSession(userSession);
        cognitoUser.getSession((err, session) => {
            if (session.isValid()) {
                // access your session
                Authenticate.login();
                navigate('/UserDashboard')
            }
            // throw error
        });
        setLoading(false);
    }

    //listen for sign in + out events, if neither are happening check if user exists 
    useEffect(() => {
        Hub.listen('auth', ({ payload }) => {
            if (payload.event === 'signIn') {
                return getUser();
            }
            if (payload.event === 'signOut') {
                setUser(null);
                return setLoading(false);
            }
        });
        getUser();
    }, []);

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
                        <button onClick ={routeChangeRegister}>Sign Up</button>
                    </form>
                </div>
                <div className="form-container sign-in-container">
                    <form className="login-form" onSubmit={handleSubmit}>
                        
                        <h1 className="sign-in-title" >Sign in</h1>
                        <span className = "error_code">{error}</span>
                        <input type="email" className={"form-control "} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" id="email" name="email" />
                        <input type="password" className={"form-control " } value={pass} onChange={(e) => setPass(e.target.value)} placeholder="********" id="password" name="password"/>
                        <Link to ="/resetPassword"><a className = "resetPasswordText">Forgot your password?</a></Link>

                        <button type = "submit" className="signin-button" >Sign In</button>
                        <button id="signUp" className="signup-button-mobile" onClick = {routeChangeRegister}>Sign Up</button>
                        {/*<button onClick={() => Auth.federatedSignIn({ provider:"Google" })}className = "signin-button">Sign in with Google</button>*/}
                    </form>

                </div>
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn">Sign In</button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello!</h1>
                            <p>Click below to sign up for an account</p>
                            <button id="signUp" className="signup-button" onClick = {routeChangeRegister}>Sign Up</button>
                        </div>
                    </div>
                </div>
            


            </div>
            
         
        </div>

    );

}

export default Login;