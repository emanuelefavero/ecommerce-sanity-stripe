/* eslint-disable @next/next/no-img-element */
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from 'react-icons/ai'

import { client, urlFor } from '@/lib/client'
import { Product } from '@/components'

export default function ProductDetail({ product, products }) {
  const { image, name, details, price } = product
  return (
    <div>
      <div className='product-detail-container'>
        <div>
          <div className='image-container'>
            <img src={urlFor(image && image[0])} alt={`${name}`} />
          </div>

          {/* <div className='small-images-container'>
            {image?.map((item, i) => (
              <img
                key={i}
                src={urlFor(item)}
                className=''
                onMouseEnter=''
                alt={`${i} ${name}`}
              />
            ))}
          </div> */}
        </div>

        <div className='product-detail-desc'>
          <h1>{name}</h1>
          <div className='reviews'>
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          <p className='price'>${price}</p>
          <div className='quantity'>
            <h3>Quantity:</h3>
            <p className='quantity-desc'>
              <span className='minus'>
                <AiOutlineMinus />
              </span>
              <span className='num'>0</span>
              <span className='plus'>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className='buttons'>
            <button type='button' className='add-to-cart'>
              Add to Cart
            </button>
            <button type='button' className='buy-now'>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className='maylike-products-wrapper'>
        <h2>You may also like</h2>
        <div className='marquee'>
          <div className='maylike-products-container track'>
            {products.map((item) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths = async () => {
  const products = await client.fetch(`*[_type == "product"]`)

  const paths = products.map((product) => ({
    params: { slug: product.slug.current },
  }))

  return {
    paths,

    // ? the server will return a 404 page for any paths that are not generated at build time. This means that all possible paths for the website must be specified in the paths array returned by getStaticPaths method.
    // fallback: false,

    // ? the server will not return a 404 page for any path that is not generated at build time. Instead, Next.js will wait for the data to be generated on the server and then render the page with the new data.
    fallback: 'blocking',
  }
}

// SSG is ideal for headless CMSs like Sanity
export const getStaticProps = async ({ params: { slug } }) => {
  const product = await client.fetch(
    // This is a sanity specific query that will get the product with the slug that matches the slug in the url
    // TIP: the [0] is used so only the first result is returned
    `*[_type == "product" && slug.current == $slug][0]`,
    { slug }
  )

  const products = await client.fetch(`*[_type == "product"]`)

  return {
    props: {
      product,
      products,
    },
  }
}
