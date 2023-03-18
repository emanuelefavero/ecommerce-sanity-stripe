# E-commerce Sanity Stripe

This is an E-commerce application built with Sanity, Next.js, and Stripe.

> Note: This is a work in progress. The application is not yet complete.

## How to create a new project like this

- create a new directory: `mkdir PROJECT-NAME` and `cd PROJECT-NAME`
- create a new nextjs app in the current directory: `npx create-next-app .`
- install all needed dependencies:

> Check the `package.json` file in this repo for all the needed dependencies.

```bash
npm install @sanity/client @sanity/image-url @stripe/stripe-js canvas-confetti next-sanity-image react-hot-toast react-icons stripe
```

- create a new Sanity project: `npm create sanity@latest -- --template clean --create-project "PROJECT-NAME" --dataset production`

> Note: You will need to create a Sanity account if you don't have one already.

- run sanity studio locally: `npm run dev` or `sanity start`

> Note: Head over to [http://localhost:3333](http://localhost:3333) to see the Sanity Studio.

- create a new schema in the `schemas` folder which is located inside the sanity project that was created in your project directory:

```ts
export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'image',
      title: 'Image',
      type: 'array',
      of: [{ type: 'image' }], // this is an array of image objects
      options: {
        // hotspot is a boolean that allows you to focus on a certain part of the image when cropping
        hotspot: true,
      },
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug', // sanity has a slug type that generates a slug
      options: {
        source: 'name', // this is the field that the slug is generated from
        maxLength: 96,
      },
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'details',
      title: 'Details',
      type: 'string',
    },
  ],
}
```

- import the schema in the `schemas/index.js` file:

```ts
import product from './product'

export const schemaTypes = [product]
```

- create content in the Sanity Studio and publish it.

- connect your app to the Sanity project by creating a `lib/client.js` file at the root of your project directory with the following code:

```js
import sanityClient from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = sanityClient({
  // run sanity manage to open the manage project webpage
  projectId: 'eglqvky8', // check project id in manage project homepage
  dataset: 'production', // check dataset name in Datasets tab

  // TODO: try to omit apiVersion
  // To check when a git project was created, run:
  // git log --reverse --format="%ai" | tail -1
  apiVersion: '2023-03-14', // when this project was created

  useCdn: true,

  // go to API tab in manage project homepage
  // and create a new token with read and write permissions (name it)
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,

  // This will ignore the browser warning about using the token in the client side (but since we are using .env and nextjs ssr we are safe)
  // sanity docs on this: https://www.sanity.io/help/js-client-browser-token
  ignoreBrowserTokenWarning: true,
})

// use sanity images and access images urls
const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
```

> Note: Remember to add the `NEXT_PUBLIC_SANITY_TOKEN` to your `.env` file.

- fetch data from Sanity in your pages with getServerSideProps (or getStaticProps if you want to use static generation):

```js
export const getServerSideProps = async () => {
  // Fetch all products and banner in the Sanity dataset
  const products = await client.fetch('*[_type == "product"]')

  return {
    props: {
      products,
    },
  }
}
```

- add `{products}` to the props of the page component:

```js
export default function Home({ products }) {
  return (
    <div>
      <h1>
        {products.map((product) => (
          <p>{product.name}</p>
        ))}
      </h1>
    </div>
  )
}
```

## Useful Sanity Studio commands

- `sanity start` - starts the Sanity Studio locally
- `npm run dev` - starts the Sanity Studio locally
- `sanity docs` - opens the Sanity Studio documentation
- `sanity manage` - opens the Sanity project management dashboard
