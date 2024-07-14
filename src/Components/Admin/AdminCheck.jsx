// Check authentication status, if user is signed in show Admin.jsx, if not then show AdminLogin.jx
import {Navigate} from 'react-router-dom';
import Admin       from "./Admin";

const AdminCheck = ({component: RouteComponent, ...rest}) =>{
    const uid = window.localStorage.getItem("uid");
    return uid ? <Admin/> : <Navigate to = "/AdminLogin"/>;
};

export default AdminCheck