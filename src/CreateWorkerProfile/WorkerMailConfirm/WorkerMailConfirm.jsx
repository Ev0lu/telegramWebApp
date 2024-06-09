import React, { useEffect, useState } from 'react';
import s from './WorkerMailConfirm.module.css';
import { Link } from 'react-router-dom';

const ClientMailConfirm = (props) => {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');
  const [code4, setCode4] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [invalid, setInvalid] = useState(false)
  const [tries, setTries] = useState(0)
  const [mail, setMail] = useState()

  useEffect(() => {
        setMail(sessionStorage.getItem('mail') !== null ? sessionStorage.getItem('mail') : '')
      }, [])

  useEffect(() => {
      if (code1 != '' && code2 != '' && code3 != '' && code4 != '' && tries < 4){
      handleSubmit()
    }
  }, [code4])

  const handleCodeChange = (index, value) => {
    switch (index) {
      case 0:
        setCode1(value.toUpperCase());
        break;
      case 1:
        setCode2(value.toUpperCase());
        break;
      case 2:
        setCode3(value.toUpperCase());
        break;
      case 3:
        setCode4(value.toUpperCase());
        break;
      default:
        break;
    }
    if (value.length === 1) {
      const nextIndex = index + 1;
      if (nextIndex < 4) {
        document.getElementById(`code-box-${nextIndex}`).focus();
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Backspace' && event.target.value === '') {
      const prevIndex = event.target.id.split('-')[2] - 1;
      if (prevIndex >= 0) {
        document.getElementById(`code-box-${prevIndex}`).focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text');
    if (pasteData.length === 4) {
      setCode1(pasteData[0].toUpperCase());
      setCode2(pasteData[1].toUpperCase());
      setCode3(pasteData[2].toUpperCase());
      setCode4(pasteData[3].toUpperCase());
    }
  };

  const handleSubmit = () => {
    const code = `${code1}${code2}${code3}${code4}`;
    if (code.length !== 4) {
    } else {
      setIsVerified(true)
      verifyCode()
      setTries(tries + 1)
    }
  };

const verifyCode = async () => {  
  let requestData = {
    email_data: {
      email: mail
    },
    code: `${code1}${code2}${code3}${code4}`
  };

  try {
    const response = await fetch('https://assista1.ru/api/v1/auth/code/verify', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      const data = await response.json();
      setIsVerified(true);
      setInvalid(false)
      setToken(`${data.session_token}`)
      sessionStorage.setItem('session_token', `${data.session_token}`)
      //тут реквест выполнять
    } else {
      const data = await response.json();
      setCode1('')
      setCode2('')
      setCode3('')
      setCode4('')
      if (tries < 4) {
          resendCode()
      }
      setInvalid(true)
    }

  } catch (error) {
  }
}

const resendCode = async () => {  
  let user = {
    email: mail,
  };

  try {
    const response = await fetch('https://assista1.ru/api/v1/auth/code/send', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });
    if (response.ok) {
      const responseData = await response.json();
    } 
  } catch (error) {

  }
}
  
  return (
    <div className={s.confirmation} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"} }> 
          <div className={s.confirmation_wrapper}>
              <div className={s.confirmation_header}>
                 <h1 className={s.confirmation_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Введите код, который был отправлен вам на почту</h1>
              </div>
                  <div className={s.code_input}>
                    <input
                      id="code-box-0"
                      type="text"
                      value={code1}
                      onChange={(e) => handleCodeChange(0, e.target.value)}
                      className={s.code_box}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={handleKeyPress}
                      onPaste={(e) => handlePaste(e)}

                      maxLength={1}
                      style={{ width: 'auto', padding: '10px', maxWidth: 40 }} // Add this line
                    />
                    <input
                      id="code-box-1"
                      type="text"
                      value={code2}
                      onChange={(e) => handleCodeChange(1, e.target.value)}
                      className={s.code_box}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={handleKeyPress}

                      maxLength={1}
                      style={{ width: 'auto', padding: '10px', maxWidth: 40 }} // Add this line
                    />
                    <input
                      id="code-box-2"
                      type="text"
                      value={code3}
                      onChange={(e) => handleCodeChange(2, e.target.value)}
                      className={s.code_box}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={handleKeyPress}

                      maxLength={1}
                      style={{ width: 'auto', padding: '10px', maxWidth: 40 }} // Add this line
                    />
                    <input
                      id="code-box-3"
                      type="text"
                      value={code4}
                      onChange={(e) => handleCodeChange(3, e.target.value)}
                      className={s.code_box}
                      onFocus={(e) => e.target.select()}
                      onKeyDown={handleKeyPress}

                      maxLength={1}
                      style={{ width: 'auto', padding: '10px', maxWidth: 40 }} // Add this line
                    />
                  </div>
                  {invalid === true && <span className={s.error_message}>Неправильный код. На почту был выслан новый код</span>}
                  {tries > 3  && <span className={s.error_message}>Вы исчерпали количество попыток, начните регистрацию заново</span>}
              <Link to={code1 == '' || code2 == '' || code3 == '' || code4 == '' || tries > 3 || isVerified === false ? '/isp_con' : '/worker_password_registration'}>
                  <button className={`${s.confirmation_btn} ${props.colorB === 'light' ? s.lightMode : s.darkMode}`} onClick={() => {

                }}>
                    Подтвердить
                  </button>
                </Link>
            </div>
    </div>
  );
};

export default ClientMailConfirm;
