# E-commerce Sanity Stripe

This is an E-commerce application built with Sanity, Next.js, and Stripe.

> Note: This is a work in progress. The application is not yet complete.

## Table of Contents

- [How to run this project locally](#how-to-run-this-project-locally)
- [**How to create a new project**](#how-to-create-a-new-project)
- [Create a new Sanity project](#create-a-new-sanity-project)
- [Run Sanity Studio locally](#run-sanity-studio-locally)
- [Create a new schema and content](#create-a-new-schema-and-content)
- [Connect your app to Sanity](#connect-your-app-to-sanity)
- [Fetch Sanity data](#fetch-sanity-data)
- [Useful Sanity commands](#useful-sanity-commands)

&nbsp;

---

&nbsp;

## How to run this project locally

- clone this repo and `cd` into it
- run `npm run dev` to start Next.js
- open a new terminal tab, `cd` into the `sanity-ecommerce` folder and run `npm run dev` to start Sanity Studio
- go to [http://localhost:3000](http://localhost:3000) to see the app

&nbsp;

---

&nbsp;

## **How to create a new project**

- create a new directory: `mkdir PROJECT-NAME` and `cd PROJECT-NAME`
- create a new nextjs app in the current directory: `npx create-next-app .`
- install all needed dependencies:

> Check the `package.json` file in this repo for all the needed dependencies.

```bash
npm install @sanity/client @sanity/image-url @stripe/stripe-js canvas-confetti next-sanity-image react-hot-toast react-icons stripe
```

&nbsp;

## Create a new Sanity project

- create a new Sanity project: `npm create sanity@latest -- --template clean --create-project "PROJECT-NAME" --dataset production`

> Note: You will need to create a Sanity account if you don't have one already.
>
> This command will create a new Sanity project in the current directory.

&nbsp;

## Run Sanity Studio locally

- `cd` into sanity project folder before running: `npm run dev` or `sanity start`

> Note: Head over to [http://localhost:3333](http://localhost:3333) to see the Sanity Studio.

&nbsp;

## Create a new schema and content

- create a new schema in the `schemas` folder which is located inside the Sanity project that was created in your project directory:

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

- import and export the schema in the `schemas/index.ts` file:

```ts
import product from './product'

export const schemaTypes = [product]
```

- create content in the Sanity Studio Dashboard at [http://localhost:3333](http://localhost:3333)
  and publish it.

&nbsp;

## Connect your app to Sanity

- create a `lib/client.js` file at the root of your project directory with the following code:

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

&nbsp;

## Fetch Sanity data

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

## Setup Revalidation

> Note: When we use SSG the page is generated at build time so when we make changes to the Sanity data, the page will not be updated. To solve this we can use revalidation.

- add `revalidate: 1` to the props of the page component:

```js
return {
  props: {
    products,
  },
  // revalidate every 60 second
  revalidate: 60,
}
```

> IMPORTANT!: Choose the value according to your needs. If you need the data to be updated frequently, choose a lower value. If you don't need the data to be updated frequently, choose a higher value.
>
> 60 = 1 minute, 3600 = 1 hour, 86400 = 1 day

&nbsp;

---

&nbsp;

## **Setup Stripe**

&nbsp;

---

&nbsp;

## Deploy App to Vercel

- remember to add the following environment variables to Vercel:

```bash
NEXT_PUBLIC_SANITY_TOKEN
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_SECRET_KEY
```

## Deploy Sanity Studio

- run `sanity deploy` to deploy the Sanity Studio to the cloud
- choose a name for your Studio hostname (e.g. `emanuelefavero-ecommerce`)
- share the link with your team members or clients

&nbsp;

---

&nbsp;

## Useful Sanity commands

- `npm run dev` - starts the Sanity Studio locally
- `sanity deploy` - deploys the Sanity Studio to the cloud (useful when you want to share the project with others)
- `sanity help` - shows all the available Sanity commands
- `sanity start` - starts the Sanity Studio locally
- `sanity docs` - opens the Sanity Studio documentation
- `sanity manage` - opens the Sanity project management dashboard
- `cmd/ctrl + shift + r` - in the browser to refresh the page and clear the cache (useful when you make changes to the Sanity data)

&nbsp;

---

&nbsp;

[**Go To Top &nbsp; ⬆️**](#e-commerce-sanity-stripe)
