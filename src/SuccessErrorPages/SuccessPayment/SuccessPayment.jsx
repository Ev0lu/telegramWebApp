import s from "./SuccessPayment.module.css"

function SuccessPayment(props) {
    setTimeout(() => props.tg.close(), 3000)
    return (
        <div className={s.payment} style={props.colorB==="light" ? {backgroundColor:"white"} : {backgroundColor:"#232323"}}>   
            <div className={s.payment_wrapper}>
                        <div className={s.notification}>
                            <h1 className={s.payment_text} style={props.colorB==='light' ? {color:'black'} : {color:'white'} }>Оплата была успешно проведена. Деньги скоро поступят на ваш счет. Обычно это занимает 1-5 минут.</h1>
                        </div>
            </div>
        </div>

    )
  }
  
  export default SuccessPayment
  
