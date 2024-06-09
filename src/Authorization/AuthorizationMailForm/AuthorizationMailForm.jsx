import { useEffect, useState } from "react";
import s from "./AuthorizationMailForm.module.css"
import { Link } from "react-router-dom";
import arrowsvg from '../../assets/arrow.svg'
import blackarr from '../../assets/black.svg'

function AuthorizationMailForm(props) {
    const [mail, setMail] = useState('');
    const [checkValid,setCheckValid] = useState('')
    const [checkExisting, setCheckExisting] = useState('exist')
    const [errorFields, setErrorFields] = useState({
        mail: false,
        checkValid: false,
        checkExisting: false
    });

    const validateFields = () => {
        const errors = {
            mail: mail === '',
            checkValid: checkValid === '',
            checkExisting: checkExisting === ''
        };
        setErrorFields(errors);
        return !Object.values(errors).some(Boolean);
    };

    useEffect(() => {
        setMail(sessionStorage.getItem('mail') !== null ? sessionStorage.getItem('mail') : '')
      }, [])


    const handleChangeMail = (event) => {
        setMail(event.target.value);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValidEmail = emailRegex.test(event.target.value);
        if (isValidEmail === true) {
            setCheckValid('exist')
        } else{
            setCheckValid('')
        }
    };
        
    const postRequest = async () => {  
    let user = {
        email: mail,
    };

    try {
        const response = await fetch('https://assista1.ru/api/v1/users/forgotPassword/code', {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
        });
        if (response.status === 400){
            setCheckExisting('')
        }
    } catch (error) {
        setCheckValid('exist')
    }
    }
    
    return (
        <div className={s.authorization} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>         
            <div className={s.authorization_wrapper}>
                <div className={s.authorization_header}>
                <Link to='/authorization'>
                    <img src={props.colorB === 'light' ? blackarr : arrowsvg} className={s.authorization_header__arrow}></img>
                </Link>
                    <h1 className={s.authorization_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Введите почту</h1>
                </div>

                <div className={s.password_input}>
                    <input
                        type={'text'}
                        placeholder="Почта"
                        className={`${s.password_field} ${errorFields.mail && s.error}`}
                        value={mail}
                        onChange={handleChangeMail}
                        style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }

                    />
                    {mail === '' && (errorFields.mail && <span className={s.error_message}>Пожалуйста, введите почту</span>)}
                    {errorFields.checkValid && <span className={s.error_message}>Почта не соответствует формату</span>}
                    {errorFields.checkExisting && <span className={s.error_message}>Почта не соответствует формату</span>}
                    </div>

                <Link to={mail !== '' && checkValid !== '' && checkExisting !== '' ? '/authorization_verify' : '/authorization_mail'}>
                    <button className={`${s.authorization_btn}`} onClick={() => {
                        sessionStorage.setItem('mail', mail)
                        if (mail !== '' && checkValid !== '') {
                            postRequest()
                        }
                        validateFields()
                    }}>Далее</button>
                </Link>
            </div>
      </div>
    )
  }
  
export default AuthorizationMailForm;
  
