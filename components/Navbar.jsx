import Link from 'next/link'
import { AiOutlineShopping } from 'react-icons/ai' // shopping icon

export default function Navbar() {
  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href='/'>Ecommerce</Link>
      </p>

      <button type='button' className='cart-icon'>
        <AiOutlineShopping />
        <span className='cart-item-qty'>1</span>
      </button>
    </div>
  )
}
