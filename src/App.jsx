import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import './App.css'


//Static pages
import Header from './Header/Header'
import Reg from './RegistrationStartPage/Reg'
import Greetings from './Greetings/Greetings';
import SuccessPayment from './SuccessErrorPages/SuccessPayment/SuccessPayment';
import SuccessAuth from './SuccessErrorPages/SuccessAuth/SuccessAuth';
import SuccessReg from './SuccessErrorPages/SuccessReg/SuccessReg';
import SuccessEdit from './SuccessErrorPages/SuccessEdit/SuccessEdit';


//Order Imports
import Edit from './Order/Edit/Edit';
import Create from './Order/Create/Create';

//Client imports
import ClientPersonalInfoForm from './CreateClientProfile/ClientPersonalInfoForm'
import ClientBirthDateForm from './CreateClientProfile/ClientBirthDateForm/ClientBirthDateForm';
import ClientContactForm from './CreateClientProfile/ClientContactForm/ClientContactForm';
import ClientMailConfirm from './CreateClientProfile/ClientMailConfirm/ClientMailConfirm';
import ClientPasswordForm from './CreateClientProfile/ClientPasswordForm/ClientPasswordForm';
import ClientUploadPhoto from './CreateClientProfile/ClientUploadPhoto/ClientUploadPhoto';
import EditClientProfile from './EditClientProfile/EditClientProfile';

//Worker imports
import WorkerPersonalInfoForm from './CreateWorkerProfile/WorkerPersonalInfoForm'
import WorkerLocationForm from './CreateWorkerProfile/WorkerLocationForm/WorkerLocationForm'
import WorkerContactForm from './CreateWorkerProfile/WorkerContactForm/WorkerContactForm'
import WorkerSkillsForm from './CreateWorkerProfile/WorkerSkillsForm/WorkerSkillsForm'
import WorkerUploadPhoto from './CreateWorkerProfile/WorkerUploadPhoto/WorkerUploadPhoto'
import WorkerMailConfirm from './CreateWorkerProfile/WorkerMailConfirm/WorkerMailConfirm';
import WorkerPasswordForm from './CreateWorkerProfile/WorkerPasswordForm/WorkerPasswordForm';
import EditWorkerProfile from './EditWorkerProfile/EditWorkerProfile';

//Auth imports
import Authorization from './Authorization/Authorization'
import AuthorizationMailConfirm from './Authorization/AuthorizationMailConfirm/AuthCon';
import AuthorizationMailForm from './Authorization/AuthorizationMailForm/AuthorizationMailForm'
import AuthorizationResetPassword from './Authorization/AuthorizationResetPassword/AuthorizationResetPassword'

const tg = window.Telegram.WebApp

function App() {
  const [colorB, setColorB] = useState("light")

  const updateColor = () => {
    tg.ready()
    if (window.Telegram.WebApp.colorScheme === "light") {
      setColorB("light")
    } else {
      setColorB("dark")
    }
  }

  useEffect( () => {
    updateColor()
  }, [])

  return (

    <div className="app">
      <Header />

        <Routes>
          <Route path="/" element={<Greetings colorB={colorB}/>} />
          <Route path="/create" element={<Create tg={tg} colorB={colorB}/>} />
          <Route path="/update/:order_id" element={<Edit tg={tg} colorB={colorB}/>} />
          <Route path="/registration" element={<Reg tg={tg} colorB={colorB} />} />
          <Route path="/client_registration" element={<ClientPersonalInfoForm tg={tg} colorB={colorB} />} />
          <Route path="/client_birthDate_registration" element={<ClientBirthDateForm colorB={colorB} />} />
          <Route path="/client_contacts_registration" element={<ClientContactForm colorB={colorB} />} />
          <Route path="/client_confirmation_registration" element={<ClientMailConfirm tg={tg} colorB={colorB} />} />
          <Route path="/client_password_registration" element={<ClientPasswordForm tg={tg} colorB={colorB} />} />
          <Route path="/client_photo_registration" element={<ClientUploadPhoto tg={tg} colorB={colorB} />} />
          <Route path="/worker_registration" element={<WorkerPersonalInfoForm tg={tg} colorB={colorB}/>} />
          <Route path="/worker_location_registration" element={<WorkerLocationForm colorB={colorB} />} />
          <Route path="/worker_contacts_registration" element={<WorkerContactForm tg={tg} colorB={colorB} />} />
          <Route path="/worker_skills_registration" element={<WorkerSkillsForm tg={tg} colorB={colorB} />} />
          <Route path="/worker_password_registration" element={<WorkerPasswordForm tg={tg} colorB={colorB} />} />
          <Route path="/worker_photo_registration" element={<WorkerUploadPhoto tg={tg} colorB={colorB} />} />
          <Route path="/worker_confirmation_registration" element={<WorkerMailConfirm tg={tg} colorB={colorB} />} />
          <Route path="/update/worker" element={<EditWorkerProfile tg={tg} colorB={colorB} />} />
          <Route path="/update/client" element={<EditClientProfile tg={tg} colorB={colorB} />} />
          <Route path="/authorization" element={<Authorization  tg={tg} colorB={colorB} />} />
          <Route path="/authorization_verify" element={<AuthorizationMailConfirm tg={tg} colorB={colorB} />} />
          <Route path="/authorization_mail" element={<AuthorizationMailForm tg={tg} colorB={colorB} />} />
          <Route path="/authorization_password" element={<AuthorizationResetPassword tg={tg} colorB={colorB} />} />
          <Route path="/failure_edit" element={<SuccessEdit tg={tg} colorB={colorB} />} /> 
          <Route path="/success_a" element={<SuccessAuth tg={tg} colorB={colorB} />} />
          <Route path="/success_r" element={<SuccessReg tg={tg} colorB={colorB} />} />
          <Route path="/payment" element={<SuccessPayment tg={tg} colorB={colorB} />} />
      </Routes> 

        </div>

  )
}

export default App
