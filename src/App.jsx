import React from 'react'
import HomePage from './pages/HomePage'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AddressProof from './pages/AddressProof'
import LostDocument from './pages/LostDocument'
import MarriageRegistration from './pages/MarriageRegistration'
import Correction from './pages/Correction'
import AfterMarriageNameChange from './pages/AfterMarriageNameChange'
import Signature from './pages/Signature'
import FirstBaby from './pages/FirstBaby'
import SingleGirl from './pages/SingleGirl'
import AddtionalName from './pages/AddtionalName'
import NameAdditionBirthCertificate from './pages/NameAdditionBirthCertificate'
import BirthCertificate from './pages/BirthCertificate'
import ShortAttendence from './pages/ShortAttendence'
import AntiRagging from './pages/AntiRagging'
import EducationLoan from './pages/EducationLoan'
import GapYear from './pages/GapYear'
import Income from './pages/Income'
import NameChange from './pages/NameChange'
import MarriageRegister from './pages/MarriageRegister'
import RentalAgreements from './pages/RentalAgreements'
// import RentAgreementPage from './pages/RentAgreementPage'


const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/address-proof" element={< AddressProof/>} />
        <Route path="/lost-document" element={<LostDocument />} />
        <Route path="/marriage-registration" element={<MarriageRegistration />} />
        <Route path="/name-addition-birth-certificate" element={<NameAdditionBirthCertificate />} />
        <Route path="/name-correction" element={<Correction />} />
        <Route path="/after-marriage-name-change" element={<AfterMarriageNameChange />} />
        <Route path="/signature" element={<Signature />} />
        <Route path="/first-baby" element={<FirstBaby />} />
        <Route path="/single-girl" element={<SingleGirl />} />
        <Route path="/additional-name" element={<AddtionalName />} />
        <Route path="/birth-certificate" element={<BirthCertificate />} />
        <Route path="/short-attendence" element={<ShortAttendence />} />
        <Route path="/anti-ragging" element={<AntiRagging />} />
        <Route path="/education-loan" element={<EducationLoan />} />
        <Route path="/gap-year" element={<GapYear />} />
        <Route path="/income" element={<Income />} />
        <Route path="/name-change" element={<NameChange />} />
        <Route path="/marriage-register" element={<MarriageRegister />} />
        <Route path="/rental-agreements" element={<RentalAgreements/>}></Route>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App