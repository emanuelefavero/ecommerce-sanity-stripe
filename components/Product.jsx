/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import { useStateContext } from '@/context/StateContext'
import { urlFor } from '@/lib/client' // used to build the sanity image url

export default function Product({ product: { image, name, slug, price } }) {
  const { setQty } = useStateContext()

  return (
    <div onClick={() => setQty(1)}>
      {/* the current part is a sanity specific thing that you need to add to the slug to get the correct path */}
      <Link href={`/product/${slug.current}`}>
        <div className='product-card'>
          <img
            src={urlFor(image && image[0])}
            alt='product first'
            width={250}
            height={250}
          />
          <p className='product-name'>{name}</p>
          <p className='product-price'>{price}</p>
        </div>
      </Link>
    </div>
  )
}
