import { useEffect, useState } from "react";
import s from "./AuthorizationResetPassword.module.css"
import { Link } from "react-router-dom";

function AuthorizationResetPassword(props) {
    const [password, setPassword] = useState('')
    const [passwordVerified, setPasswordVerified] = useState('')
    const [check,setCheck] = useState('')
    const [mail,setMail] = useState(sessionStorage.getItem('mail'))
    const [token,setToken] = useState(sessionStorage.getItem('session_token'))

    //errors
    const [errorFields, setErrorFields] = useState({
        password: false,
        passwordVerified: false,
        check: false
        });

    const validateFields = () => {
        const errors = {
            password: password === '',
            passwordVerified: passwordVerified === '',
            check: check === ''
            };
        setErrorFields(errors);
        return !Object.values(errors).some(Boolean);
    };

    useEffect(() => {
        setToken(sessionStorage.getItem('session_token'))
    },[passwordVerified])

    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const handleChangePasswordVerified = (event) => {
        setPasswordVerified(event.target.value);
    };
        
    const postRequestResetPassword = async () => {  
      let user = {
        email: mail,
        new_password: password
      };

      try {
        const response = await fetch('https://assista1.ru/api/v1/users/forgotPassword/reset', {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'X-SESSION-TOKEN': `${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        });
        if (response.ok) {
          const data = await response.json();
        } 
      } catch (error) {
        setCheck('')
      }
    }

    return (
        <div className={s.authorization} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>         
          <div className={s.authorization_wrapper}>
            <div className={s.authorization_header}>
                <h1 className={s.authorization_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Введите пароль</h1>
            </div>

            <div className={s.password_input}>
                <input
                    type={'text'}
                    placeholder="Пароль"
                    className={`${s.password_field} ${errorFields.password && s.error}`}
                    value={password}
                    onChange={handleChangePassword}
                    style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                />
                {password === '' && (errorFields.password && <span className={s.error_message}>Пожалуйста, введите пароль</span>)}

                </div>
            <div className={s.password_input}>
                <input
                    type={'text'}
                    placeholder="Подтверждение пароля"
                    className={`${s.password_field} ${errorFields.passwordVerified && s.error}`}
                    value={passwordVerified}
                    onChange={handleChangePasswordVerified}
                    style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                />
            {password === '' && (errorFields.passwordVerified && <span className={s.error_message}>Пожалуйста, подтвердите пароль</span>)}
            {password !== passwordVerified && <span className={s.error_message}>Пароли должны совпадать</span>}
            {password.length < 10 && <span className={s.error_message}>Размер пароля должен составлять от 10 до 25 символов</span>}
            {password.length > 24 && <span className={s.error_message}>Размер пароля должен составлять от 10 до 25 символов</span>}
            </div>

            <Link to={password === passwordVerified && (password.length > 9) && (password.length < 25) ? '/authorization' : '/authorization_password'}>
                <button className={`${s.authorization_btn}`} onClick={() => {
                    if (password === passwordVerified  && (password.length > 9) && (password.length < 25)) {
                        postRequestResetPassword()
                    }
                    validateFields()
                }}>Далее</button>
            </Link>
          </div>
      </div>
    )
  }
  
export default AuthorizationResetPassword;
  
