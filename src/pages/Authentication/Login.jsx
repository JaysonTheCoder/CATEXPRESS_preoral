import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Visibility } from '@mui/icons-material'
import { VisibilityOff } from '@mui/icons-material'
import Loader from '../partials/Loader'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../../../firebaseConfig'
function Login() {
    const navigate = useNavigate()
    const [ showPass, setShowPass ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [error, setError] = useState('')
    const [isOnline, setIsOnline] = useState(true);


    const checkInternetConnection = async () => {
        try {
          const testQuery = query(collection(db, "admins"));
          const a = await getDocs(testQuery);
          if(a.empty) {
            setIsOnline(false)
          } else {
            setIsOnline(true)
          }
        } catch (error) {
          setIsOnline(false);
        }
      };
    
    useEffect(() => {
      checkInternetConnection()
        
      const handleOnline = () => checkInternetConnection();
      const handleOffline = () => setIsOnline(false);
  
      
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
        
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }, []);
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true)
        const data = {
            email: email,
            password: password
        }
            try {
                const usersCollection = collection(db, "admins");
                const q = query(usersCollection, where("email", "==", data.email), where("password", "==", data.password));
                const querySnapshot = await getDocs(q);
                  

                if (!isOnline) {
                    setError("No internet connection. Please check your connection and try again.");
                    setLoading(false)
                    return;
                } 
                else if (querySnapshot.empty) {
                  setError("Invalid email or password.");
                  setLoading(false)
                } else {
                  navigate("/home")
                  setLoading(false)
                  setEmail("");
                  setPassword("");
                }
              } catch (error) {
                setError("Error logging in: " + error.message);
                setLoading(false)
              }
        
      

      };
    
  return (
    <div className="login-container">
        {
            loading && <Loader />
        }
        <div className="login-form-wrap">
            <div className="form-title">
                {/* <p>Login</p> */}
            </div>
            <div className="err-container">
                <p>
                    {
                        error && error
                    }
                </p>
            </div>
            <div className="form">
                <div className="input">
                    <input value={ email } onChange={(e)=> setEmail(e.target.value)} type="text" required id='email' />
                    <label htmlFor="email" >Email </label>
                </div>
                <div className="input">
                    <input value={ password } onChange={(e)=> setPassword(e.target.value)} type={ showPass ? "text":"password"} required id='password'/>
                    <label htmlFor="password">Password </label>
                    <button onClick={()=> setShowPass(showPass ? false:true)} className='showVisibility'>
                        {
                            !showPass ? <Visibility style={{fontSize: 13, color: "#00000090"}}/>:<VisibilityOff style={{fontSize: 13,  color: "#00000090"}}/>
                        }
                    </button>
                </div>
                <button id='submit' onClick={handleLogin}>Login</button>
                <Link to="/signup"><i>create new account?</i></Link>
            </div>
        </div>
    </div>
  )
}

export default Login