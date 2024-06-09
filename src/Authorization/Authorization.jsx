import React, { useState, useEffect } from 'react';
import s from './Authorization.module.css';
import { Route, Routes, Link, Router } from 'react-router-dom';
import eyed from '../assets/eye-clos.svg'
import eyeLight from '../assets/eye-closed.svg'


const Authorization = (props) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(true);
    const [response, setResponse] = useState('')
    const [tokenAccess, setTokenAccess] = useState('');
    const [tokenRefresh, setTokenRefresh] = useState('')

    //errors
    const [errorFields, setErrorFields] = useState({
        password: password,
        login: login,
    });

    const validateFields = () => {
      const errors = {
        password: password === '',
        login: login === '',  
      };
      setErrorFields(errors);
      return !Object.values(errors).some(Boolean);
  };

    useEffect(() => {
        setTimeout(() => { setShowPassword(false)}, 500)
    },[])

    useEffect(() => {
      setShowPassword(false)
    },[])

    useEffect(() => {
        if (password == '') {
            setShowPassword(true)
        } else {
            setTimeout(() => setShowPassword(false), 200)
        }        
    }, [password])


    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleChangePassword = (event) => {
      setPassword(event.target.value);
    };

    const handleChangeLogin = (event) => {
      setLogin(event.target.value.replace(/[^A-Za-z0-9!@#$%^&*()]/g, ''));
    };

    const postRequest = async () => {
      let user = {
        login: login,
        password: password
      };

      try {
        const response = await fetch('https://assista1.ru/api/v1/auth/login', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });

        if (response.ok) {
                const responseData = await response.json();
                setTokenRefresh(responseData.refresh_token)
                setTokenAccess(responseData.access_token)
                const data = {
                    access_token: responseData.access_token,
                    refresh_token: responseData.refresh_token     
                  };
                  if ((responseData.detail !== 'Incorrect login or password') || (responseData.detail !== '')) {
                    props.tg.sendData(JSON.stringify(data))
                    props.tg.close()    
                }
              } else {
                    const responseData = await response.json();
                      setResponse(responseData.detail)
                  }
              } catch (error) {
                console.error('Ошибка:', error);
              }
            }


    return (
        <div className={s.authorization} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>
              <div className={s.authorization_wrapper}>
              <h1 className={s.authorization_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Авторизация</h1>
              <div className={s.password_input}>
                  <input
                      style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                      type={'text'}
                      placeholder="Логин"
                      className={s.password_field}
                      value={login}
                      onChange={handleChangeLogin}
                  />            
                      { login === '' && (errorFields.login && <span className={s.error_message}>Пожалуйста, введите логин</span>)}
              </div>
                  
                <div className={s.password_input}>
                  <input
                      style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Пароль"
                      className={s.password_field}
                      value={password}
                      onChange={handleChangePassword}
                  />
                    <img className={s.toggle_password} onClick={handleTogglePassword} src={props.colorB === 'dark' ? eyed : eyeLight}></img>
                      { password === '' && (errorFields.password && <span className={s.error_message}>Пожалуйста, введите пароль</span>)}
                      { response === 'Incorrect login or password'  &&  <span className={s.error_message}>Неверный логин или пароль</span>}
                      <Link to='/authorization_mail'>
                      <span className={s.spanForgot} style={props.colorB==='light' ? {color:'black'} : {color:'white'}}>Забыл пароль</span>
                  </Link>
              </div>
            
              <Link to={(password.length < 10) || (password.length > 25) || (response === 'Incorrect login or password') || (response === '') ? '/authorization' : '/success_a'}>
              <button onClick={ () => {
                  validateFields()
                if ( login !== '' && password !== ''){
                    postRequest()
                }
                  
              }
             } className={`${s.authorization_btn2} ${props.colorB==="light" ? s.authPassword1 : s.authPassword1}` }>Далее</button>
              </Link>
              </div>
        </div>
    );
};

export default Authorization;