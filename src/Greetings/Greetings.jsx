import { useState } from "react";
import s from "./Greetings.module.css"
import { Route, Routes, Link, Router } from 'react-router-dom';
function Greetings(props) {
    const [isRegistered, setIsRegistered] = useState(false);
    const [isRegistered2, setIsRegistered2] = useState(false);
    return (
        <div className={s.greetings} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"}}>   
        <div className={s.greetings_wrapper}>
        <h1 className={s.greetings_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Добро пожаловать</h1>
            <Link to="/registration">
                <button onClick={() => {setIsRegistered(true)}} className={`${s.greetings_btn} ${isRegistered ? s.lightMode1 : (props.colorB === 'light' ? s.lightMode : s.darkMode)}`}>Зарегистироваться</button>
            </Link> 
            <Link to="/authorization">
                <button onClick={() => {
                    setIsRegistered2(true)
                    setIsRegistered(false)
                }} className={`${s.greetings_btn} ${isRegistered2 ? s.lightMode1 : (props.colorB === 'light' ? s.lightMode : s.darkMode)}`}>У меня уже есть аккаунт</button>
            </Link>
            </div>
        </div>

    )
  }
  
  export default Greetings
  