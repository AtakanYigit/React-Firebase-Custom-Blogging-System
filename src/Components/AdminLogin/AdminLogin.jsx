import {useNavigate} from "react-router-dom";
import {getAuth, signInWithEmailAndPassword } from "firebase/auth";
import "./AdminLogin.scss";

const AdminLogin = () => {
    const navigate = useNavigate();

    const loginHandler = (e) => {
        e.preventDefault();
        const mail = e.target.Mail.value;
        const password = e.target.Password.value;
        const auth = getAuth();

        signInWithEmailAndPassword(auth, mail, password)
            .then((userCredential) => {
                const user = userCredential.user;
                window.localStorage.setItem("uid", user.uid);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });

        navigate("/Admin");
    }

    return (
        <>
            <div className = "adminLogin">
                <form onSubmit = {loginHandler} className = "loginForm">
                    <h1>Welcome Admin</h1>
                    <input type = "email"    placeholder = "Mail"     name = "Mail"     id = "Mail" />
                    <input type = "password" placeholder = "Password" name = "Password" id = "Password" />
                    <input type = "submit"   value = "Login"/>
                </form>
            </div>
        </>
    );
}

export default AdminLogin;
	