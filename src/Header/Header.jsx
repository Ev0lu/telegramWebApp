import logo from '../assets/newLogo.png'
import '../Header/Header.css'
function Header() {

  return (
   <div className={'header'}>
    <div className="imageLogo">
        <img className='image' src={logo}></img>
    </div>
   </div>
  )
}

export default Header
