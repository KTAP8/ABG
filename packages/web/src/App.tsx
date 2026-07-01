import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import DropPage from './pages/DropPage'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Waitlist from './pages/Waitlist'
import Iykyk from './pages/Iykyk'
import Archive from './pages/Archive'
import About from './pages/About'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drop/:slug" element={<DropPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/iykyk" element={<Iykyk />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}
