import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BsBagCheckFill } from 'react-icons/bs'

import { useStateContext } from '@/context/StateContext'

import { runConfetti } from '@/lib/utils'

export default function Success() {
  const { setCartItems, setTotalPrice, setTotalQuantities } = useStateContext()

  useEffect(() => {
    localStorage.clear()
    setCartItems([])
    setTotalPrice(0)
    setTotalQuantities(0)

    // * CONFETTI ANIMATION
    runConfetti()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className='success-wrapper'>
      <div className='success'>
        <p className='icon'>
          <BsBagCheckFill />
        </p>

        <h2>Thank you for your order</h2>
        <p className='email-msg'>Check your email inbox for the receipt.</p>
        <p className='description'>
          If you have any questions, please email
          <a className='email' href='mailto:info@emanuelefavero.com'>
            info@emanuelefavero.com
          </a>
        </p>
        <Link href='/'>
          <button type='button' width='300px' className='btn'>
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  )
}
