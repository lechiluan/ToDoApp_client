import React from 'react';
import styles from './styles.module.css';
import { Link, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import axios  from 'axios';


const Signup = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: ""
    });
    const [error,setError] = useState("")

    const navigate = useNavigate();

    const handleChange = ({ currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    }

    const handleSubmit = async (e)=> {
        e.preventDefault();
        try {
            const url = "https://15.235.203.180:443/api/users"
            const {data:res} = await axios.post(url,data);
            navigate("/signin");
            console.log(res.message);
        } catch (error) {
            if(error.response && 
                error.response.status >= 400 &&
                error.response.status <= 500){
                    setError(error.response.data.message)
                }
        }
    }

    return (
        <div className={styles.signup_container}>
            <div className={styles.signup_form_container}>
                <div className={styles.left}>
                    <h1>Welcome Back</h1>
                    <Link to="/signin">
                        <button type="submit" className={styles.btn_white}>Sign In</button>
                    </Link>
                </div>
                <div className={styles.right}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Create New Account</h1>
                        <input 
                            type="text"  placeholder='First Name' name='firstName' 
                            onChange={handleChange}
                            value={data.firstName} required className={styles.input}  
                        />

                        <input 
                            type="text"  placeholder='Last Name' name='lastName' 
                            onChange={handleChange}
                            value={data.lastName} required className={styles.input}  
                        />

                        <input 
                            type="email"  placeholder='Email' name='email' 
                            onChange={handleChange}
                            value={data.email} required className={styles.input}  
                        />

                        <input 
                            type="password"  placeholder='Password' name='password' 
                            onChange={handleChange}
                            value={data.password} required className={styles.input}  
                        />

                        {/* display error */}
                        {error && <div className={styles.error_msg}>{error}</div>}
                        <button type="submit" className={styles.btn_green}>
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
            
        </div>
    );
}

export default Signup;