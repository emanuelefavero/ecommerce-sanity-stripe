/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

export default function HeroBanner() {
  return (
    <div className='hero-banner-container'>
      <div>
        <p className='beats-solo'>SMALL TEXT</p>
        <h3>MID TEXT</h3>
        {/* TODO: change to nextjs Image component */}
        <img src='' alt='headphones' className='hero-banner-image' />

        <div>
          <Link href='/product/ID'>
            <button type='button'>BUTTON TEXT</button>
          </Link>
          <div className='desc'>
            <h5>Description</h5>
            <p>DESCRIPTION</p>
          </div>
        </div>
      </div>
    </div>
  )
}
