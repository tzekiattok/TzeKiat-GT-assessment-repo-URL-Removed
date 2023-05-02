import React, {createContext,useState} from "react";
import Pool from "../../UserPool";
import {CognitoUser, AuthenticationDetails} from "amazon-cognito-identity-js";
import { useNavigate } from "react-router-dom";
import Authenticate from "../../components/Auth";
import { Hub, Auth } from 'aws-amplify';
import {reactLocalStorage} from 'reactjs-localstorage';

const AccountContext = createContext();
const Account = (props)=>{
    let navigate = useNavigate();
    reactLocalStorage.setObject('isLoading', {'isLoading': false})
    const getSession = async()=>{
        reactLocalStorage.setObject('isLoading', {'isLoading': true})
        return await new Promise((resolve, reject)=>{
            const user = Pool.getCurrentUser();
            if (user){
                user.getSession((err,session) =>{
                    if (err){
                        reject();
                        reactLocalStorage.setObject('isLoading', {'isLoading': false})
                    }
                    else{
                        resolve(session);
                        reactLocalStorage.setObject('jwt', {'jwt': session.accessToken.jwtToken})
                        reactLocalStorage.setObject('isLoading', {'isLoading': false})
                    }
                });
            }
            else{
                reject();
            }
        })
    }

    const authenticate = async (Username, Password) =>{
        return await new Promise((resolve, reject) =>{
            const user = new CognitoUser({
                Username,
                Pool,
            })
    
            const authDetails = new AuthenticationDetails({
                Username,
                Password
            })
    
            user.authenticateUser(authDetails, {
                onSuccess:(data) =>{
                    resolve(data);
                    Authenticate.login();
                    let path = '/userDashboard'; 
                    navigate(path);
                },
                onFailure:(err)=>
                {
                    reject(err);
                },
                newPasswordRequired:(data)=>{
                    resolve(data);
                }
    
            })
        });
    }
    const logout =()=>{
        const user = Pool.getCurrentUser();
        Auth.signOut()
        Authenticate.logout();

        if (user){
            user.signOut();
        }
    };

    return (
        <AccountContext.Provider value = {{authenticate,getSession, logout}}>
            {props.children}
        </AccountContext.Provider>
    );
};
export {Account, AccountContext}