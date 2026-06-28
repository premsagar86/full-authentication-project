import {Routes, Route} from 'react-router-dom'
import Signup from './pages/Signup'
import Home from './pages/home'
import Signin from './pages/Signin'
import Landing1 from './pages/Landing1'
import Forgotpassword from './pages/Forgotpassword'
import ProtectedRoute from './pages/ProtectedRoute'
import AuthContext from './components/AuthContext'
import { Toaster } from 'react-hot-toast';
import Verify from './pages/verify'
function App() {

  return (
    <>
      <AuthContext>
      <Routes>   
        <Route path='/' element={<Landing1/>}/> 
        <Route path='/signup' element={<Signup/>}/> 
        <Route path='/verify-email' element={<Verify/>}/>
        <Route path='/signin' element={<Signin/>}/> 
        <Route path='/forgot-password' element={<Forgotpassword/>}/> 
        <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>}/>
      </Routes>
      <Toaster />
      </AuthContext>
    </>
  )
}

export default App
