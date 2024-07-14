import React, {Suspense} from "react";
import {Routes, Route}   from "react-router-dom";
import {app}             from "./Firebase";
const AdminCheck = React.lazy(() => import("./Components/Admin/AdminCheck"));
const Home       = React.lazy(() => import("./Components/Home/Home"));
const Post       = React.lazy(() => import("./Components/Post/Post"));
const Error      = React.lazy(() => import("./Components/Error/Error"));
import "./App.scss"

const App = () =>{
    return (
        <Suspense fallback = {<Error/>}>
            <Routes>
                <Route path = "/"            element = {<Home/>}/>
                <Route path = "/AdminLogin"  element = {<AdminCheck/>}/>
                <Route path = "/Admin"       element = {<AdminCheck/>}/>
                <Route path = "/Post/:param" element = {<Post/>}/>
                <Route path = "*"            element = {<Error/>}/>
            </Routes>
        </Suspense>
    );
}

export default App;
