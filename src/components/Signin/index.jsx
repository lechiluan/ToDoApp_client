import React from 'react';
import styles from './styles.module.css';
import { Link} from 'react-router-dom';
import {useState} from 'react';
import axios  from 'axios';




const Signup = () => {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [error,setError] = useState("")

    const handleChange = ({ currentTarget: input}) => {
        setData({...data, [input.name]: input.value});
    }

    const handleSubmit = async (e)=> {
        e.preventDefault();
        try {
            const url = "https://luanle.gcalls.vn:443/api/auth"
            const {data:res} = await axios.post(url,data);
            localStorage.setItem("token",res.data);
                        window.location="/"
        } catch (error) {
            if(error.response && 
                error.response.status >= 400 &&
                error.response.status <= 500){
                    setError(error.response.data.message)
                }
        }
    }

    return (
        <div className={styles.signin_container}>
            <div className={styles.signin_form_container}>
                <div className={styles.left}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                            <h1>Sign In to Todo App</h1>
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
                                Sign in
                            </button>
                        </form>
                </div>
                <div className={styles.right}>
                <h1>Register Here</h1>
                    <Link to="/signup">
                        <button type="submit" className={styles.btn_white}>Sign Up</button>
                    </Link>
                </div>
            </div>
            
        </div>
    );
}

export default Signup;