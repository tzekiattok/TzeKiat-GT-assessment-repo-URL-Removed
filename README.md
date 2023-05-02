# Tok Tze Kiat web application 

IMPORTANT:
The current deployed github repo does not have the URL endpoints. This is because I am using API Gateway endpoints, with JWT authentication disabled. To protect myself from having exposed API endpoints, I removed all API URLs in this web application. Do contact me at toktzekiat@gmail.com for the URLS/repo with URL.

Steps to run the react application locally:
1. Open the folder on vsc
2. npm install (If it is your first time running this file. Installation takes about 5 minutes)
3. npm start
(The web application should start on your browser)

Must-do features completed:
- User view, browse items
- Admin view, backend API server

Additional useful features
- Frontend
    - Protected routes (restrict user access to admin features)
    - Login, signup, reset password page
- Backend
    - Login, signup and reset password
    - JWT authorization (disabled for now)
    - JWT Token authentication

Tech stack:
Frontend
- ReactJS, HTML, CSS

Backend
- NodeJS (Lambda authorizers), Python (CRUD), NoSQL
- S3 Bucket (hosting), AWS Lambda (backend), DynamoDB (database), Cognito (authentication, authorization)

Accounts:
Admin: 
username: toktzekiat@gmail.com
Password: Unclejack1*

As for regular user account, you can choose to sign up using your own email. I do not have any capability to see your credentials since it is handled by cognito.

* Front-end files are in src/scenes for UI, src/components for authorization logic

For more detailed documentation with images:
https://docs.google.com/document/d/1oCcZT5O2bhiQejXmT7ux_A9jXXaSNYPBwXM-JKKYd1A/edit?usp=sharing

May uncle jack be impressed :0