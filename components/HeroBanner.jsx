/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { urlFor } from '@/lib/client'

export default function HeroBanner({ heroBanner }) {
  return (
    <div className='hero-banner-container'>
      <div>
        <p className='beats-solo'>{heroBanner.smallText}</p>
        <h3 className='sale-title'>{heroBanner.midText}</h3>
        <h1>{heroBanner.largeText1}</h1>

        {/* TODO: change to nextjs Image component */}
        <img
          src={urlFor(heroBanner.image)}
          alt='headphones'
          className='hero-banner-image'
        />

        <div>
          {/* NOTE: Since the slug is the same as product name, we can navigate to /product/heroBanner.product which is the name of the product used on the banner */}
          <Link href={`/product/${heroBanner.product}`}>
            <button type='button'>{heroBanner.buttonText}</button>
          </Link>
          <div className='desc'>
            <h5>Description</h5>
            <p>{heroBanner.desc}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
