import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Resources from "./scenes/resources";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Login from "./scenes/login/login";
import Signup from "./scenes/signup/signup";
import {Account} from "./scenes/accounts/Account";
import PrivateRoute from "./components/PrivateRoute.js";
import AuthenticatedRoute from "./components/AuthenticatedRoute.js";
import ResetPassword from "./scenes/resetPassword/resetPassword";
import ResourcesAdmin from "./scenes/adminResources";
import AdminRoute from "./components/AdminRoute.js";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const {pathname} = useLocation();
  //hideSideBar, topBar if not logged in
  //let hideTopBar = window.location.pathname === '/' ? null : <Topbar setIsSidebar={setIsSidebar} />
  //let hideSideBar = window.location.pathname === '/'  ? null : <Sidebar isSidebar={isSidebar} />
  
  return (
    
    <Account>
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* hide sidebar in login page and signin */}
          {pathname !== '/' && pathname !=='/signup' && pathname !=='/resetPassword' &&  <Sidebar/>}
          <main className="content">
            {/* hide topbar in login page and signin */}
            {/*pathname !== '/' && pathname !=='/signup' && pathname !=='/resetPassword' &&  <Topbar/>*/}
            <Routes>
              {/* Authenticated Route -> Redirects user to landing page IF they are authenticated*/}
              <Route element = {<AuthenticatedRoute/>}>
                  <Route path="/" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/resetPassword" element={<ResetPassword />} />
              </Route>
              {/* Private Route -> Redirects users to login page IF they are not authenticated */}
              <Route element = {<PrivateRoute/>}>
                {/* Admin access only*/}
                <Route element = {<AdminRoute/>}>
                  <Route path = "/resourcesadmin" element = {<ResourcesAdmin/>}/>
                </Route>
                {/* User access*/}
                <Route path="/resources" element={ <Resources />} />
                <Route path="*" element={<Resources />} />

              </Route>
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
    </Account>
  );
  
}

export default App;
