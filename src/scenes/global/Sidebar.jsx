import { useState, useContext, useEffect } from "react";
import { ProSidebar, Menu, MenuItem,SidebarFooter, } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link,useNavigate } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import PeopleIcon from '@mui/icons-material/People';
import useForceUpdate from 'use-force-update';
import Status from "../accounts/Status";
import Role from "../accounts/Role";
import Email from "../accounts/Email";
import {AccountContext} from "../accounts/Account";
import {reactLocalStorage} from 'reactjs-localstorage';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import TextsmsIcon from '@mui/icons-material/Textsms';
const navigate = useNavigate;
const redirectHome =()=>{
  navigate('/');
}
const Item = ({ title, to, icon, selected, setSelected,Onclick }) => {
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem //highlight if active
      active={selected === to}
      style={{
        color: colors.grey[200],
      }}
      onClick={() => setSelected(to)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const LogoutItem = ({ title, to, icon, selected, setSelected}) => {
  const {logout} = useContext(AccountContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem //highlight if active
      active={selected === to}
      style={{
        color: colors.grey[200],
      }}
      onClick={logout}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState(window.location.pathname);
  const [role,setRole] = useState();
  const {getSession} = useContext(AccountContext);
  const link1= {
    color: 'white',
    position: 'relative',
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '0',
      height: '2px',
      bottom: '-3px',
      left: '50%',
      transform: 'translate(-50%,0%)',
      backgroundColor: 'red',
      visibility: 'hidden',
      transition: 'all 0.3s ease-in-out',
    },
    '&:hover:before': {
      visibility: 'visible',
      width: '100%',
    },
  };
  useEffect(()=>
      {
          getSession().then(session =>{
              //session data -> session.idToken.payload
              //jwt token-> session.accessToken
              if(session.accessToken.payload['cognito:groups'].includes('Admin'))
            {
              setRole('Admin');
            }
            else{
              setRole('User');
            }
          });
      },[]);
  useEffect(()=>{

  },[role])
  const forceUpdate = useForceUpdate();
  return (
    <Box
      sx={{
       
        "& .pro-sidebar-inner": {
          //sidebar background
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#ffc013!important",//set sidebar active highlight color
        },
        "& .pro-menu-item.active": {
          color: "#ffc013 !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[200],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[200]}
                style = {link1}
                onClick = {redirectHome}
                >
                  MINIMART
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon style={{
              margin: "10px 0 20px 0",
              color: colors.grey[200],
            }}/>
                </IconButton>
              </Box>
            )}
          </MenuItem>
          
          {//Profile
          !isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
              <Typography
                  variant="h5"
                  color={colors.grey[200]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                <h1>Welcome</h1>
                </Typography>
                {/*<img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
          />*/}
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h5"
                  color={colors.grey[200]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  <Email/>
                </Typography>
                <Typography variant="h5" color={colors.grey[200]}>
                  <Role/>
                </Typography>
              </Box>
            </Box>
          )}
          
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Typography
              variant="h6"
              color={colors.grey[200]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              <b>Pages</b>
            </Typography>
            <Item
              title="View Items"
              to="/resources"
              icon={<LibraryBooksIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {role === "Admin" &&(
              <>
              <Typography
              variant="h6"
              color={colors.grey[200]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              <b>Admin</b>
            </Typography>
              <Item
              title="Manage Items"
              to="/resourcesadmin"
              icon={<DriveFolderUploadIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            </>
            )}
            
          </Box>
        </Menu>
        <SidebarFooter>
          <Menu //config for logout positioning css
          >
            <Box paddingLeft={isCollapsed ? undefined : "10%"}
            >
              <LogoutItem
                title="Logout"
                to="/"
                icon={<LogoutIcon/>}
                selected={selected}
                setSelected={setSelected}
              /> 
             
            </Box>
          </Menu>
          </SidebarFooter>
      </ProSidebar>
      {forceUpdate}
    </Box>
  );
};

export default Sidebar;
