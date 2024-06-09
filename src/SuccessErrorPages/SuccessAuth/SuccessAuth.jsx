import s from "./SuccessAuth.module.css"
function SuccessAuth(props) {
    return (
        <div className={s.greetings} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"}}>   
        <div className={s.greetings_wrapper}>
        <h1 className={s.greetings_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Вы успешно авторизированы</h1>
            </div>
        </div>

    )
  }
  
  export default SuccessAuth
  
