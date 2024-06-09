import { useEffect, useState } from "react";
import s from "./ClientContactForm.module.css"
import { Link, useNavigate } from 'react-router-dom';
import arrowsvg from '../../assets/arrow.svg'
import blackarr from '../../assets/black.svg'

function ClientContactForm(props) {

    const [login, setLogin] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneConfirmed, setPhoneConfirmed] = useState('');
    const [mail, setMail] = useState('');


    const navigate = useNavigate()

    const [exist, setExist] = useState(sessionStorage.getItem('exist') === 'true');
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'));


    //errors to check if everything is correct
    const [errorFields, setErrorFields] = useState({
        login: false,
        phone: false,
        mail: false,
        checkValidMail: false,
        checkIsValidPhone: false,
        checkUniqueLoginPhone: false
    });

    const [loginError, setLoginError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [checkIsValidPhone,setCheckIsValidPhone] = useState('')
    const [checkUniqueLoginPhone, setCheckUniqueLoginPhone] = useState('')
    const [messagePhoneErrorText,setMessagePhoneErrorText] = useState('')
    const [checkValidMail,setCheckValidMail] = useState('')

    const validateFields = () => {
        const errors = {
            login: login === '',
            phone: phone === '',
            mail: mail === '',
            checkValidMail: checkValidMail === '',
            checkIsValidPhone: checkIsValidPhone === '',
            checkUniqueLoginPhone: checkUniqueLoginPhone === ''
        };
        setErrorFields(errors);
        return !Object.values(errors).some(Boolean);
    };

//funcs to check if text in field valid
    const handleLoginChange = (event) => {  
        setLogin(event.target.value.replace(/[^A-Za-z0-9!@#$%^&*()]/g, ''));
    };

    const handlePhoneChange = (event) => {
        const isValidPhone = /^\+/.test(event.target.value)
        if (isValidPhone === true) {
            setCheckIsValidPhone('true')
        } else{
            setCheckIsValidPhone('')
        }
        setPhone(event.target.value);
    };

    const handleMailChange = (event) => {
        setMail(event.target.value);
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const isValidEmail = emailRegex.test(event.target.value);
        if (isValidEmail === true) {
            setCheckValidMail('true')
        } else{
            setCheckValidMail('')
        }
    };

    useEffect(() => {
        setLogin(sessionStorage.getItem('login') !== null ? sessionStorage.getItem('login') : '')
        setPhone(sessionStorage.getItem('phone') !== null ? sessionStorage.getItem('phone') : '')
        setMail(sessionStorage.getItem('mail') !== null ? sessionStorage.getItem('mail') : '')
        if(exist === true){
          fetchInfo()
          }
      }, [])

        
const postRequest = async () => {  
  let mailData = {
    email: mail,
  };

  try {
    const response = await fetch('https://assista1.ru/api/v1/auth/code/send', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(mailData)
    });
    if (response.ok) {
      const responseData = await response.json();
      if (responseData.session_token) {
        sessionStorage.setItem('session_token', responseData.session_token)

        return navigate("/client_password_registration")
        }
    } 
  } catch (error) {
  }
}

const checkUniqueF = async () => {  
  let dataUnique = {
    login: login,
    phone: phone
  };

  try {
    const response = await fetch('https://assista1.ru/api/v1/auth/registration/checkUnique', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataUnique)
    });
    if (response.status === 200) {
      setPhoneConfirmed(phone)
      setCheckUniqueLoginPhone('true')
      setLoginError('')
      setPhoneError('')
    } else {    
      const responseData = await response.json();
      if (responseData.detail[0]?.msg ? responseData.detail[0].msg.includes("login") : responseData.detail.includes("login")){
            setLoginError('true')
        } else{
            setLoginError('')
        }
        if (responseData.detail.includes("phone")){
            setPhoneError('true')
            setMessagePhoneErrorText('Пользователь с указанным телефоном уже существует')
        } else if (responseData.detail[0]?.msg ? responseData.detail[0].msg.includes("phone") : false) {
            setPhoneError('true')
            setMessagePhoneErrorText('Телефон не валиден')
        } else {
            setPhoneError('')
            setPhoneConfirmed(phone)
        }
  }} catch (error) {
  }
}


  const handleInputBlur = () => {       
          if (exist !== 'true') {
                if (login !== '' && phone !== '' && phone.split('').length > 6){
                  checkUniqueF()
              }         
            } 
          };


 const fetchInfo = async () => {
    try {
      const response = await fetch(`https://assista1.ru/api/v1/users/me`,{
        method: 'GET',
        headers: {
           'Authorization': `Bearer ${accessToken}`,
        }
      });
      const data = await response.json();

          setLogin(`${data.login}`)
          setPhone(`${data.phone.split('-').join('')}`)
          sessionStorage.setItem('login', data.login)
          sessionStorage.setItem('phone', data.phone.split('-').join(''))
          sessionStorage.setItem('mail', data.email)
          setPhoneConfirmed(`${data.phone.split('-').join('')}`)
          setMail(`${data.email}`)
          setPhoneError('')
          setLoginError('')
          setCheckUniqueLoginPhone('true')
          setCheckIsValidPhone('true')
          setCheckValidMail('true')
          handleLoginChange(`${data.login}`)
          handlePhoneChange(`${data.phone.split('-').join('')}`)
          handleMailChange(`${data.email}`)
          validateFields()
    } catch (error) {
        
    }
  };


    
    return (
        <div className={s.contact_form} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>         
          <div className={s.contact_form_wrapper}>
            <div className={s.contact_form_header}>
                <Link to='/client_birthDate_registration'>
                    <img src={props.colorB === 'light' ? blackarr : arrowsvg} className={s.contact_form_header_arrow}></img>
                </Link>
                    <h1 className={s.contact_form_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Регистрация</h1>
            </div>
            <div className={s.contact_input}>
                <input
                    disabled={Boolean(exist)}
                    type={'text'}
                    placeholder="Придумайте логин"
                    className={`${s.infoField} ${errorFields.login && s.error}`}
                    value={login}
                    onChange={handleLoginChange}
                    style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                    onBlur={handleInputBlur}

                />
                {login === '' && (errorFields.login && <span className={s.error_message}>Пожалуйста, введите логин</span>)}
                {loginError === 'true' && <span className={s.error_message}>Логин уже существует</span>}

            </div>
            <div className={s.contact_input}>
                <input
                    disabled={Boolean(exist)}
                    type={'text'}
                    placeholder="Номер телефона"
                    className={`${s.infoField} ${(errorFields.phone || errorFields.checkIsValidPhone) && s.error}`}
                    value={phone}
                    onChange={handlePhoneChange}
                    style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                    onBlur={handleInputBlur}

                />
            {phoneConfirmed === '' && (errorFields.phone && <span className={s.error_message}>Пожалуйста, введите телефон</span>)}
            {phone.split('').length < 7 && (errorFields.phone && <span className={s.error_message}>Пожалуйста, введите правильный телефон</span>)}
            {errorFields.checkIsValidPhone && <span className={s.error_message}>Номер должен начинаться с кода страны(+...)</span>}
            {phoneError === 'true' && <span className={s.error_message}>{messagePhoneErrorText}</span> }

            </div>
            <div className={s.contact_input}>
                <input
                    disabled={Boolean(exist)}
                    type={'text'}
                    placeholder="Почта"
                    className={`${s.infoField} ${errorFields.mail && s.error}`}
                    value={mail}
                    onChange={handleMailChange}
                    style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                />
                {mail === '' && (errorFields.mail && <span className={s.error_message}>Пожалуйста, введите почту</span>)}
                {errorFields.checkValidMail && <span className={s.error_message}>Почта не соответствует формату</span>}
                </div>
          

            <Link to={(login !== '' && phone.split('').length > 6 && phoneConfirmed !== '' && mail !== '' && checkValidMail !== '' && checkIsValidPhone !== '' && phoneError === '' && loginError === ''  && phone === phoneConfirmed) ? '/client_confirmation_registration' : '/client_contacts_registration'}>
                <button className={`${s.contact_form_btn}`} onClick={() => {
                  if (sessionStorage.getItem('exist') !== 'true') {
                    sessionStorage.setItem('login', login)
                    sessionStorage.setItem('phone', phoneConfirmed)
                    sessionStorage.setItem('mail', mail)
                  }
                    if (login !== '' && phone.split('').length > 6 && phoneConfirmed !== '' && mail !== '' && checkValidMail !== '' && checkIsValidPhone !== ''  && phoneError === '' && loginError === ''  && phone === phoneConfirmed) {
                        postRequest()
                    }
                    validateFields()
                }}>Далее</button>
            </Link>
        </div>
      </div>
    )
  }
  
export default ClientContactForm;
  
