import { useEffect, useState } from "react";
import s from "./ClientPersonalInfoForm.module.css"
import { Link } from "react-router-dom";
import arrowsvg from '../assets/arrow.svg'
import blackarr from '../assets/black.svg'


function ClientPersonalInfoForm(props) {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [gender, setGender] = useState('');
    const [telegramId, setTelegramId] = useState(sessionStorage.getItem('tgId'))
    const [errorFields, setErrorFields] = useState({
        name: false,
        lastName: false,
        gender: false
    });

  //this variable for checking is user already exists
  const [isExist, setIsExist] = useState(null)
  const [exist, setExist] = useState(sessionStorage.getItem('exist') === 'true');
  const [accessToken, setAccessToken] = useState(sessionStorage.getItem('accessToken'));
  
  useEffect(() => {
    setLastName(sessionStorage.getItem('lastName') !== null ? sessionStorage.getItem('lastName') : '')
    setMiddleName(sessionStorage.getItem('middleName') !== null ? sessionStorage.getItem('middleName') : '')
    setName(sessionStorage.getItem('name') !== null ? sessionStorage.getItem('name') : '')
    setGender(sessionStorage.getItem('gender') !== null ? sessionStorage.getItem('gender') : '')
    fetchUserExists();

    if(sessionStorage.getItem('exist') === 'true'){
      getInfo()
        }
  }, [])


//This function checks if user already exists
  const fetchUserExists = async () => {
    try {
      const response = await fetch(`https://assista1.ru/api/v1/users/check/client?telegram_id=${telegramId}`);
      const data = await response.json();
      const exist = await data.exist;
      setIsExist(JSON.stringify(exist))
    } catch (error) {
    }
  };



  const handleNameChange = (event) => {
    const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
    setName(sanitizedValue);
  };
  const handleLastNameChange = (event) => {
    const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
    setLastName(sanitizedValue);
  };
  const handleMiddleNameChange = (event) => {
    const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
    setMiddleName(sanitizedValue);
  };
  const handleGenderChange = (event) => {
      setGender(event.target.value);
    };
  
// if this value in object return true -> then error shows
const validateFields = () => {
        const errors = {
            name: name === '',
            lastName: lastName === '',
            gender: gender === ''

        };
        setErrorFields(errors);
        return !Object.values(errors).some(Boolean);
    };



//function to refresh tokens
const refreshTokens = async () => {  
  let refreshData = {
    refresh_token: `${sessionStorage.getItem('refresh_token')}`,
  };

  try {
    const response = await fetch('https://assista1.ru/api/v1/auth/refreshToken', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(refreshData)
    });
    if (response.ok) {
      const responseData = await response.json();
      sessionStorage.setItem('accessToken', responseData.access_token)
      sessionStorage.setItem('refresh_token', responseData.refresh_token)     

    } else {
        const data = {
            "status": "unauthorized"
        }

        props.tg.sendData(JSON.stringify(data))
    }
  } catch (error) {

  }
}

//Getting info about user if that user already exists
const getInfo = async () => {
    try {
      const response = await fetch(`https://assista1.ru/api/v1/users/me`,{
        method: 'GET',
        headers: {
           'Authorization': `Bearer ${accessToken}`,
        }
      });

        if(response.status !== 401) {
                  const data = await response.json();
                  sessionStorage.setItem('name', data.full_name.split(' ')[0])
                  sessionStorage.setItem('lastName', data.full_name.split(' ')[1])
                  sessionStorage.setItem('middleName', data.full_name.split(' ')[2])
                  sessionStorage.setItem('gender', data.gender)
                  setName(`${data.full_name.split(' ')[0]}`)
                  setLastName(`${data.full_name.split(' ')[1]}`)
                  setMiddleName(data.full_name.split(' ')[2] ? `${data.full_name.split(' ')[2]}` : '')
                  setGender(`${data.gender}`)
                  handleGenderChange(`${data.gender}`)
                  handleNameChange(`${data.full_name.split(' ')[0]}`)
                  handleLastNameChange(`${data.full_name.split(' ')[1]}`)
                  handleMiddleNameChange(`${data.full_name.split(' ')[2]}`)
                  validateFields()
           } else {
                  refreshTokens()
           }
    } catch (error) {
    }
  };




    
    return (
        <div className={s.personalInfo} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }> 
            <div className={s.personalInfo_wrapper}>
                  <div className={s.personalInfoHeader}>
                      <Link to={`/registration?telegram_id=${telegramId}&access_token=${accessToken}&exists=${exist}`}>
                          <img src={props.colorB === 'light' ? blackarr : arrowsvg} className={s.personalInfo_arrow}></img>
                      </Link>
                          <h1 className={s.personalInfo_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Регистрация</h1>
                  </div>
                  <div className={`${s.nameField}`}>
                      <input
                          style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }

                          type={'text'}
                          placeholder="Имя*"
                          className={`${s.infoField} ${errorFields.name && s.error}`}
                          value={name}
                          disabled={Boolean(exist)}
                          onChange={handleNameChange}
                      />
                      { name === '' && (errorFields.name && <span className={s.error_message}>Пожалуйста, введите ваше имя</span>)}

                  </div>
                  <div className={`${s.lastNameField}`}>
                      <input
                      style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                          type={'text'}
                          placeholder="Фамилия*"
                          className={`${s.infoField} ${errorFields.lastName && s.error}`}
                          value={lastName}
                          disabled={Boolean(exist)}
                          onChange={handleLastNameChange}
                      />
                      {lastName === '' && (errorFields.lastName && <span className={s.error_message}>Пожалуйста, введите фамилию</span>)}
                  </div>
                  <div className={s.middleNameField}>
                      <input
                          style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                          type={'text'}
                          placeholder="Отчество"
                          className={s.infoField}
                          value={middleName}
                          disabled={Boolean(exist)}
                          onChange={handleMiddleNameChange}
                      />
                  </div>



                  <div className={`${s.radio_gender}`} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>
                      <label htmlFor="gender" style={{ fontSize: '14px' }}>Ваш пол:</label>
                      <div>
                          <input disabled={Boolean(exist)} type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={handleGenderChange} />
                          <label htmlFor="male" className={s.genderlabel}>Мужской</label>
                      </div>
                      <div>
                          <input disabled={Boolean(exist)} type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={handleGenderChange} />
                          <label htmlFor="female" className={s.genderlabel}>Женский</label>
                      </div>
                      {gender === '' && (errorFields.gender && <span className={s.error_message}>Выберите ваш пол</span>)}
                      {isExist === true  && (<span className={s.error_message}>Такой пользователь уже существует</span>) }
                      {isExist === undefined  && (<span className={s.error_message}>Пожалуйста, откройте приложение в телеграме</span>)}</div>
                      
                  <Link to={gender === '' || name === '' || lastName === '' || isExist === true || isExist === null ? '/client_registration' : '/client_birthDate_registration'}>
                      <button className={s.personalInfo_btn} onClick={() => {
                        if (sessionStorage.getItem('exist') !== 'true') {
                          sessionStorage.setItem('name', name)
                          sessionStorage.setItem('lastName', lastName)
                          sessionStorage.setItem('middleName', middleName)
                          sessionStorage.setItem('gender', gender)
                        }
                          validateFields()
                      }}>Далее</button>
                  </Link>
            </div>
      </div>
    )
  }
  
  export default ClientPersonalInfoForm
