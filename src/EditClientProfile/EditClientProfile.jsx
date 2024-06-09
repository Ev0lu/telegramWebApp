import React, { useRef, useState, useEffect } from 'react';
import s from './EditClientProfile.module.css';
import { Link } from 'react-router-dom';
import { useParams, useLocation } from 'react-router-dom';
import plus from '../assets/plus.svg'
import minus from '../assets/minus.svg'
import lightplus from '../assets/lightplus.svg'
import lightminus from '../assets/lightminus.svg'


function EditClientProfile(props) {

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [accessToken, setAccessToken] = useState(searchParams.get('access_token'));
  const [refreshToken, setRefreshToken] = useState(searchParams.get('refresh_token'));
  // Получение значений параметров access_token и refresh_token из URL

  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('')
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const months = [
    "январь", "февраль", "март", "апрель",
    "май", "июнь", "июль", "август",
    "сентябрь", "октябрь", "ноябрь", "декабрь"
  ];

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()-17);
  const [err, setErr] = useState(null);
  const [phoneVerified, setPhoneVerified] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [selectedDateStr, setSelectedDateStr] = useState('');
  const [checkPh,setCheckPh] = useState('')
  const [messageerr, setMessageerr] = useState('')

  const [errorFields, setErrorFields] = useState({
    name: false,
    lastName: false,
    gender: false,
    selectedDate: false,
    err: false
  });

  const validateFields = () => {
    const errors = {
      selectedDate: selectedDate === null,
      err: err === true,
      name: name === '',
      lastName: lastName === '',
    };
    setErrorFields(errors);
    return !Object.values(errors).some(Boolean);
  };


  const handleGenderChange = (event) => {
      setGender(event.target.value);
    };


  const handleChangeName = (event) => {
      const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
      setName(sanitizedValue);
      
    };

  const handleChangeLastName = (event) => {
      const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
      setLastName(sanitizedValue);
    };
  const handleChangeMiddleName = (event) => {
      const sanitizedValue = event.target.value.replace(/[<>%$&!*^`/"',.|#@()\[\]{}0-9]/g, '');
      setMiddleName(sanitizedValue);
    };

  const handleChangePhone = (event) => {
      const isValidPhone = /^\+/.test(event.target.value)
      if (isValidPhone === true) {
          setCheckPh('true')
      } else{
          setCheckPh('')
      }
      setPhone(event.target.value);
      setPhoneError('')
    };
    

  useEffect(() => {
      if (selectedYear > (new Date().getFullYear())-17 || selectedYear < (new Date().getFullYear()) - 100) {
          setErr(true);
      } else {
          setErr(false);
      }
  }, [selectedYear,selectedDate]);


  const toggleCalendar = () => {
        setShowCalendar(!showCalendar);
      };
    
  const handleMonthChange = (delta) => {
        setSelectedMonth((prevMonth) => {
          let newMonth = prevMonth + delta;
          if (newMonth < 0) newMonth = 11;
          if (newMonth > 11) newMonth = 0;
          return newMonth;
        });
      };
    
  const handleYearChange = (delta) => {
        if (selectedYear >= (new Date().getFullYear())-17){
          setSelectedYear((prevYear) => (prevYear + delta) <= new Date().getFullYear()-17 ? (prevYear + delta) : prevYear );
        } else {
            setSelectedYear((prevYear) => prevYear + delta);
        }
      };
    
  const handleDateClick = (day) => {
        setSelectedDate(new Date(selectedYear, selectedMonth, day));
        setSelectedDateStr(`${day < 10 ? '0' : ''}${day}.${selectedMonth - 1 < 8 ? '0' : ''}${selectedMonth + 1}.${selectedYear}`);
        setShowCalendar(!showCalendar);
      };      

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

  const fetchInfo = async () => {
    try {
      const response = await fetch(`https://assista1.ru/api/v1/users/me`,{
        method: 'GET',
        headers: {
           'Authorization': `Bearer ${accessToken}`,
        }
      });
      
      if (response.status === 401 || response.status === 400){
        refreshTok()
    }
      const data = await response.json();
      setName(`${data.full_name.split(' ')[0]}`)
      setLastName(`${data.full_name.split(' ')[1]}`)
      setMiddleName(data.full_name.split(' ')[2] ? `${data.full_name.split(' ')[2]}` : '')
      setGender(`${data.gender}`)
      setPhone(`${data.phone.split('-').join('')}`)
      setPhoneVerified(`${data.phone.split('-').join('')}`)
      setSelectedDate(new Date(Number(data.client.birth_date.split('-').reverse()[2]), Number(data.client.birth_date.split('-').reverse()[1])-1, Number(data.client.birth_date.split('-').reverse()[0])));
      setSelectedYear(Number(data.client.birth_date.split('-').reverse()[2]))
      setSelectedMonth(Number(data.client.birth_date.split('-').reverse()[1])-1)
      setSelectedDateStr(new Date(Number(data.client.birth_date.split('-').reverse()[2]), Number(data.client.birth_date.split('-').reverse()[1])-1, Number(data.client.birth_date.split('-').reverse()[0])).toLocaleDateString('ru-RU'));
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchInfo()
  },[])

  const refreshTok = async () => {  
    let user = {
      refresh_token: `${refreshToken}`,
    };
  
    try {
      const response = await fetch('https://assista1.ru/api/v1/auth/refreshToken', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });
      if (response.ok) {
        const responseData = await response.json();
        sessionStorage.setItem('accessToken', responseData.access_token)
        setRefreshToken(responseData.refresh_token)     
      } else {
       const responseData = await response.json();
          const data = {
              "status": "unauthorized"
          }
          props.tg.sendData(JSON.stringify(data))
      }
    } catch (error) {
  
    }
  }

const patchProfile = async () => {
    const requestBody = {
      "birth_date":  `${selectedYear}-${selectedMonth+1 < 10 ? '0' + `${selectedMonth+1}` : selectedMonth+1 }-${selectedDate.getDate() < 10 ? '0' + `${selectedDate.getDate()}` : selectedDate.getDate()  }`,
      "profile": {
          "full_name": name + ' ' + lastName + `${middleName !== '' ? ' ' + middleName : ''}`,
          "gender": `${gender}`,
          "phone": `${phone}`
        }
    }

    try {
      const response = await fetch(`https://assista1.ru/api/v1/users/update/client`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(requestBody)
      });

        if (response.ok) {
          const data = await response.json();
          props.tg.sendData(JSON.stringify(data))
        } else if (response.status === 401) {
             refreshTok()
        } else if (response.status === 400){
          const responseData = await response.json();
          if (responseData.detail.includes("phone")) {
             setPhoneError('true')
            setMessageerr('Указанный телефон уже существует')
          }} else if (response.status === 422){
            setPhoneError('true')
            setMessageerr('Телефон не валиден')
          }
      
    } catch (error) {

    }
};

const handleDateChange = (e) => {
  let input = e.target.value.replace(/\D/g, ''); // Удаляем все нечисловые символы
  if (input.length > 8) input = input.slice(0, 8); // Ограничиваем длину строки

  let formattedDate = '';
  if (input.length > 4) {
      formattedDate = input.slice(0, 2) + '.' + input.slice(2, 4) + '.' + input.slice(4, 8);
  } else if (input.length > 2) {
      formattedDate = input.slice(0, 2) + '.' + input.slice(2, 4);
  } else {
      formattedDate = input;
  }

  setSelectedDateStr(formattedDate);

  if (input.length === 8) {
      const day = parseInt(formattedDate.slice(0, 2), 10);
      const month = parseInt(formattedDate.slice(3, 5), 10);
      const year = parseInt(formattedDate.slice(6, 10), 10);

      if (isValidDate(day, month, year)) {
          const formattedDay = day < 10 ? '0' + day : day;
          const formattedMonth = month < 10 ? '0' + month : month;

          sessionStorage.setItem('birth_date', `${formattedDay}-${formattedMonth}-${year}`);

          const birthDate = new Date(year, month - 1, day);

          setSelectedDate(birthDate);
          setSelectedYear(year);
          setSelectedMonth(month - 1);
      } else {
          setSelectedDate(null);
      }
  }
};

const isValidDate = (day, month, year) => {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};



  return (
    <div className={s.editProfile} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }>  
            <div className={s.editProfile_wrapper}>
                  <div className={s.reg}>
                      <h1 className={s.editProfile_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Редактирование профиля</h1>
                  </div>

              <div className={`${s.edit_input}`}>
                      <input
                          style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }

                          type={'text'}
                          placeholder="Имя*"
                          className={`${s.edit_field} ${errorFields.name && s.error}`}
                          value={name}
                          onChange={handleChangeName}
                      />
                      { name === '' && (errorFields.name && <span className={s.error_message}>Пожалуйста, введите ваше имя</span>)}

                  </div>
                  <div className={`${s.edit_input}`}>
                      <input
                      style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }                type={'text'}
                          placeholder="Фамилия*"
                          className={`${s.edit_field} ${errorFields.lastName && s.error}`}
                          value={lastName}
                          onChange={handleChangeLastName}
                      />
                      { lastName === '' && (errorFields.lastName && <span className={s.error_message}>Пожалуйста, введите фамилию</span>)}
                  </div>
                  <div className={s.edit_input3}>
                      <input
                          style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }                type={'text'}
                          placeholder="Отчество"
                          className={s.edit_field}
                          value={middleName}
                          onChange={handleChangeMiddleName}
                      />

                  </div>
                  <div className={s.edit_input}>
                      <input
                          type={'text'}
                          placeholder="Номер телефона"
                          className={`${s.edit_field} ${(errorFields.phone || errorFields.checkPh) && s.error}`}
                          value={phone}
                          onChange={handleChangePhone}
                          style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }

                      />
                  {phoneVerified === '' && (errorFields.phone && <span className={s.error_message}>Пожалуйста, введите телефон</span>)}
                  {phone.split('').length < 7 && (errorFields.phone && <span className={s.error_message}>Пожалуйста, введите правильный телефон</span>)}
                  {phoneError === 'true' && <span className={s.error_message}>{messageerr}</span> }
                  {errorFields.checkPh && <span className={s.error_message}>Номер должен начинаться с кода страны(+...)</span>}
                  </div>

                  <div className={`${s.radio_gender}`} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>
                      <label htmlFor="gender" style={{ fontSize: '14px' }}>Ваш пол:</label>
                      <div>
                          <input type="radio" id="male" name="gender" value="male" checked={gender === 'male'} onChange={handleGenderChange} />
                          <label htmlFor="male" className={s.genderlabel}>Мужской</label>
                      </div>
                      <div>
                          <input type="radio" id="female" name="gender" value="female" checked={gender === 'female'} onChange={handleGenderChange} />
                          <label htmlFor="female" className={s.genderlabel}>Женский</label>
                      </div>
                  </div>

                <div className={s.date_picker}>
                <div className={s.date_flex}>
                <input
                  type="text"
                  className={`${s.edit_field} ${errorFields.selectedDate && s.error}`}
                  style={props.colorB==='light' ? {backgroundColor:'white', color:'black'} : {backgroundColor:'#232323', color:'#C7C7C7'} }
                  value={selectedDateStr}
                  onChange={handleDateChange}
                />

                </div>
                <div className={`${s.icon} `} onClick={toggleCalendar}>
                  {showCalendar ? <img src={props.colorB === 'light' ? lightplus : plus}></img>: <img src={props.colorB === 'dark' ? minus : lightminus}></img>}
                </div>
                {selectedDate === null && (errorFields.selectedDate && <span className={s.error_message2}>Пожалуйста, введите дату</span>)}
                {errorFields.err && <span className={s.error_message3}>Вы должны быть старше 16 лет</span>}
                {showCalendar && (
                  <div className={`${s.calendar} ${props.colorB === 'light' ? s.light : s.dark}`}>
                    <div className={s.nav}>
                      <div className={`${s.arrow} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => handleMonthChange(-1)}>
                        {'<'}
                      </div>
                      <div>{months[selectedMonth]}</div>
                      <div className={`${s.arrow} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => handleMonthChange(1)}>
                        {'>'}
                      </div>
                      <div className={`${s.arrow} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => handleYearChange(-1)}>
                        {'<'}
                      </div>
                      <div>{selectedYear}</div>
                      <div className={`${s.arrow} ${props.colorB === 'light' ? s.light : s.dark}`} onClick={() => handleYearChange(1)}>
                        {'>'}
                      </div>
                    </div>
                    <div className={`${s.days} ${props.colorB === 'light' ? s.light : s.dark}`}>
                    {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => (
                        <div
                          key={day}
                          className={selectedDate && selectedDate.getDate() === day ? s.selected : {}}
                          onClick={() => handleDateClick(day)}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
                    
                <Link to='/update/client'>
                  <button onClick={() => {
                    validateFields()
                    if (selectedDate !== null && err !== true && name !== '' && lastName !== '' && phone !== ''){
                      patchProfile()
                    }
                  }}className={`${s.editProfile_btn} ${s.editProfile_btn0} ${props.colorB === 'light' ? s.light : s.dark}`}>Редактировать</button>
                </Link>
                <Link to={'/update/client'}>
                  <button onClick={() => {
                      props.tg.close()
                  }}className={`${s.editProfile_btn} ${props.colorB === 'light' ? s.light : s.dark}`}>Отменить</button>
                </Link>
          </div>
    </div>
  );
}

export default EditClientProfile;
