
// import React from 'react'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import './index.css'
// import { BrowserRouter } from 'react-router-dom'
// import { AuthProvider } from './context/AuthContext.jsx'
// import { CartProvider } from './context/CartContext.jsx'
// import { ToastContainer } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <AuthProvider>
//       <CartProvider>
//         <App />
//         <ToastContainer position="top-right" autoClose={1000} />
//       </CartProvider>
//     </AuthProvider>
//   </BrowserRouter>
// )














import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Providers
import { BrowserRouter } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'

// Toast
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const clientId = '597459255678-do5rmmr3remd5eijicb80u0lkeb84fvf.apps.googleusercontent.com' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
            <ToastContainer position="top-right" autoClose={1000} />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
)
