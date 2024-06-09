import s from "./SuccessEdit.module.css"
function SuccessEdit(props) {
    setTimeout(() => props.tg.close(), 3000)
    return (
        <div className={s.greetings} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"}}>   
        <div className={s.greetings_wrapper}>
        <h1 className={s.greetings_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Сессия истекла</h1>
            </div>
        </div>

    )
  }
  
  export default SuccessEdit
  
