import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './lib/auth-context'
import { AuthToasts } from './lib/auth-toasts'
import { ToastProvider } from './lib/toast-context'
import Home from './pages/Home'
import DropPage from './pages/DropPage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Waitlist from './pages/Waitlist'
import Iykyk from './pages/Iykyk'
import Archive from './pages/Archive'
import About from './pages/About'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Shipping from './pages/Shipping'
import Returns from './pages/Returns'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AuthToasts />
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/drop/:slug" element={<DropPage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/iykyk" element={<Iykyk />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile" element={<Profile />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
