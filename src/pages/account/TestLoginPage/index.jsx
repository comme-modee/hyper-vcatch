import { useState } from 'react';
import React from 'react'

const Login = () => {
    let [id, setId] = useState('');
    let [pw, setPw] = useState('');

    const handleIdChange = (e) => {
        const newId = e.target.value;
        console.log('ID:', newId);
        setId(newId);
    }
    const handlePwChange = (e) => {
        const newPw = e.target.value;
        console.log('Password:', newPw);
        setPw(newPw);
    }
    
    const handleLogin = async () => {
        const apiUrl = 'http://211.252.30.69:8080/api/auth/login';

        try {
            fetch(apiUrl, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: id, password: pw}),
            })
            .then(response => {
                if (response.ok) {
                return response.json(); 
                } else {
                throw new Error(response.statusText);
                }
            })
            .then(data => {
                console.log('Token:', data);
                localStorage.setItem('jwtToken', data.accessToken); 
            })
            .catch(error => {
                console.error(error);
            });
        } catch (error) {
            console.error('오류 발생:', error);
        }
    }
    const getToken = () => {
        let token = localStorage.getItem('jwtToken');
        fetch("http://211.252.30.69:8080/api/data", {
        method: "GET", 
        headers: {
            "Authorization": "Bearer " + token 
        }
        }).then(function(response) {
        
        if (response.ok) {
            return response.text(); 
        }
        throw new Error(response.statusText);

        }).then(function(text) {
            console.log(text); 

        }).catch(function(error) {
            console.error(error); 
        });
    }

  return (
    <div className="container">
        <div className="login">
            <div className="header"><img src="" alt=""/></div>
            <div className="form">
                <div>Login</div>
                <div className='wrap'>
                    <div>
                        <p>ID</p>
                        <input id="username" type="text" name="username" required="" placeholder="Enter your ID" onChange={handleIdChange}/>
                    </div>
                    <div>
                        <p>Password</p>
                        <input id="password" type="password" name="password" placeholder="Enter your password" onChange={handlePwChange}/>
                    </div>
                </div>
                <button className='login-btn' onClick={handleLogin}>Log In</button>
                <button onClick={getToken}>get Token</button>
            </div>
        </div>
    </div>
  )
}

export default Login