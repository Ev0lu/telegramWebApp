import { useEffect, useState } from "react";
import s from "./ClientPasswordForm.module.css"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import eyed from '../../assets/eye-clos.svg'
import eyeLight from '../../assets/eye-closed.svg'

function ClientPasswordForm(props) {
    const [showPassword, setShowPassword] = useState(true);
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const navigate = useNavigate();

    const [errorFields, setErrorFields] = useState({
        password: false,
        passwordConfirm: false,
    });

    useEffect(() => {
        setTimeout(() => { setShowPassword(false)}, 500)
    },[])
// there is a bug in telegram webapp, that's why the default variable has a value and changes by useEffect
    useEffect(() => {
          setShowPassword(false)
    },[])



    useEffect(() => {
        if (password == '') {
            setShowPassword(true)
        } else {
          setTimeout(() => setShowPassword(false), 200)
        }
    },[password, passwordConfirm])

    const validateFields = () => {
        const errors = {
            password: password === '',
            passwordConfirm: passwordConfirm === '',
        };
        setErrorFields(errors);
        return !Object.values(errors).some(Boolean);
    };

    const handleTogglePassword = () => {
      setShowPassword(!showPassword);
  };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handlePasswordConfirmChange = (event) => {
        setPasswordConfirm(event.target.value);
    };



const createClient = async () => {  
     let userInfo = {
        profile: {
          telegram_id: Number(sessionStorage.getItem('tgId')),
          login: sessionStorage.getItem('login'),
          email: sessionStorage.getItem('mail'),
          full_name: sessionStorage.getItem('name') + ' ' + sessionStorage.getItem('lastName') + `${sessionStorage.getItem('middleName') !== null ? ' ' + sessionStorage.getItem('middleName') : ''}`,
          phone: sessionStorage.getItem('phone'),
          gender: sessionStorage.getItem('gender'),
          password: password,
        },

        client:{
          birth_date: sessionStorage.getItem('birth_date')
        }
  };
  try {
    const response = await fetch(`https://assista1.ru/api/v1/auth/registration/client`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-SESSION-TOKEN': `${sessionStorage.getItem('session_token')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userInfo)
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem('access_token', data.access_token)
      sessionStorage.setItem('profile_id', data.profile_id)
      sessionStorage.setItem('refresh_token', data.refresh_token)
      return navigate("/zak_reg_photo")
    } else if (response.status === 400 || response.status === 401) {
      return navigate("/success_r")
    }
  } catch (error) {
  }
}    
    return (
        <div className={s.passwordForm} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>         
          <div className={s.passwordForm_wrapper}>
              <div className={s.passwordForm_header}>
                  <h1 className={s.passwordForm_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Введите пароль</h1>
              </div>
              <div className={s.password_input}>
                  <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Придумайте пароль"
                      className={`${s.password_field} ${errorFields.password && s.error}`}
                      value={password}
                      onChange={handlePasswordChange}
                      style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                      
                  />
                  <img className={s.toggle_password} onClick={handleTogglePassword} src={props.colorB === 'dark' ? eyed : eyeLight}></img>
                  { password === '' && (errorFields.password && <span className={s.error_message}>Пожалуйста, введите пароль</span>)}

              </div>
              <div className={s.password_input}>
                      <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Подтверждение пароля"
                          className={`${s.password_field} ${errorFields.passwordConfirm && s.error}`}
                          value={passwordConfirm}
                          onChange={handlePasswordConfirmChange}
                          style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                      />
                      { password === '' && (errorFields.passwordConfirm && <span className={s.error_message}>Пожалуйста, подтвердите пароль</span>)}
                      { password !== passwordConfirm && <span className={s.error_message}>Пароли должны совпадать</span>}
                      { password.length < 10 && <span className={s.error_message}>Размер пароля должен составлять от 10 до 25 символов</span>}
                      { password.length > 24 && <span className={s.error_message}>Размер пароля должен составлять от 10 до 25 символов</span>}
              </div>

              <Link to={password === passwordConfirm && (password.length>9) && (password.length < 25) ? '' : '/client_password_registration'}>
                  <button className={`${s.passwordForm_btn}`} onClick={() => {
                            if(password === passwordConfirm  && (password.length>9) && (password.length < 25)){
                                  createClient()
                            }
                            validateFields()
                  }}>Далее</button>
              </Link>
          </div>
      </div>
    )
  }
  
export default ClientPasswordForm;
  
