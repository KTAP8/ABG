import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DropPage from './pages/DropPage'
import ProductDetail from './pages/ProductDetail'
import Waitlist from './pages/Waitlist'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drop/:slug" element={<DropPage />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/waitlist" element={<Waitlist />} />
      </Routes>
    </BrowserRouter>
  )
}
