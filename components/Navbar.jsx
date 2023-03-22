import Link from 'next/link'
import { AiOutlineShopping } from 'react-icons/ai' // shopping icon

import { Cart } from '@/components'
import { useStateContext } from '@/context/StateContext'

export default function Navbar() {
  const { showCart, setShowCart, totalQuantities } = useStateContext()

  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href='/'>Ecommerce</Link>
      </p>

      <button
        type='button'
        className='cart-icon'
        // open the cart when the user clicks on the cart icon
        onClick={() => setShowCart(true)}
      >
        <AiOutlineShopping />
        <span className='cart-item-qty'>{totalQuantities}</span>
      </button>

      {/* only show the cart when user clicks on the cart icon above */}
      {showCart && <Cart />}
    </div>
  )
}
