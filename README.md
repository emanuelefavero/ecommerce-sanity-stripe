# E-commerce Sanity Stripe

This is an E-commerce application built with Sanity, Next.js, and Stripe.

> Note: This is a work in progress. The application is not yet complete.

## Demo

- [https://ecommerce-sanity-stripe-cyan-pi.vercel.app/](https://ecommerce-sanity-stripe-cyan-pi.vercel.app/)

#### screenshot

![screenshot](./screenshot.jpg 'screenshot')

## Table of Contents

- [How to run this project locally](#how-to-run-this-project-locally)
- [**How to create a new project**](#how-to-create-a-new-project)
- [Create a new Sanity project](#create-a-new-sanity-project)
- [Run Sanity Studio locally](#run-sanity-studio-locally)
- [Create a new Sanity schema](#create-a-new-sanity-schema)
- [Upload content to Sanity](#upload-content-to-sanity)
- [Connect your app to Sanity](#connect-your-app-to-sanity)
- [Fetch Sanity data](#fetch-sanity-data)
- [Setup Revalidation](#setup-revalidation)
- [**Stripe**](#stripe)
- [Install Stripe](#install-stripe)
- [Setup Stripe](#setup-stripe)
- [Create a Stripe API endpoint](#create-a-stripe-api-endpoint)
- [Create an instance of Stripe](#create-an-instance-of-stripe)
- [Create a checkout button](#create-a-checkout-button)
- [Create a success page](#create-a-success-page)
- [Create a canceled page](#create-a-canceled-page)
- [Deploy App to Vercel](#deploy-app-to-vercel)
- [**Deploy Sanity Studio**](#deploy-sanity-studio)
- [Useful Sanity commands](#useful-sanity-commands)

&nbsp;

---

&nbsp;

## How to run this project locally

- clone this repo and `cd` into it
- run `npm install` to install all dependencies
- `cd` into the `sanity-ecommerce` folder and run `npm install` to install all Sanity dependencies

- create a `.env.local` file in the root directory and add the following:

```bash
# SANITY
# Go to the API section of your Sanity project, create a new token and copy it
# choose token permissions depending on your needs
# @link https://www.sanity.io/manage
NEXT_PUBLIC_SANITY_TOKEN=''

# STRIPE
# Go to the developers section of your Stripe account and copy the keys
# @see https://dashboard.stripe.com/test/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=''
NEXT_PUBLIC_STRIPE_SECRET_KEY=''
```

- run `npm run dev` to start Next.js
- open a new terminal tab, `cd` into the `sanity-ecommerce` folder and run `npm run dev` to start Sanity Studio
- go to [http://localhost:3000](http://localhost:3000) to see the app
- go to [http://localhost:3333](http://localhost:3333) to see the Sanity Studio and upload content there

> Note: If you instead need to update content in Sanity Studio for the production version, got to [this link](https://emanuelefavero-ecommerce.sanity.studio/desk)

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

## Create a new Sanity schema

- create a new schema in the `schemas` folder which is located inside the Sanity project that was created in your project directory:

- `schemas/product.ts`

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

> Note: Create as many schemas as you need and import them in the `schemas/index.ts` file.

&nbsp;

## Upload content to Sanity

- run the Sanity Studio locally again

```bash
cd sanity-ecommerce # (or whatever you named your project)
npm run dev
```

- open the Sanity Studio Dashboard at [http://localhost:3333](http://localhost:3333) and upload some content

&nbsp;

## Connect your app to Sanity

- go to [https://www.sanity.io/manage](https://www.sanity.io/manage) and select your project
- go to the `API tab` and select `Tokens`
- create a new token with read and write permissions (name it)

> Note: Here you can choose to create a token with read-only permissions if you don't need to update content in Sanity Studio from your app code.

- copy the token
- add it to the `NEXT_PUBLIC_SANITY_TOKEN` in your `.env.local` file:

```bash
NEXT_PUBLIC_SANITY_TOKEN='Your sanity API token'
```

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

  // This will ignore the browser warning about using the token in the client side (but since we are using .env.local and nextjs ssr we are safe)
  // sanity docs on this: https://www.sanity.io/help/js-client-browser-token
  ignoreBrowserTokenWarning: true,
})

// use sanity images and access images urls
const builder = imageUrlBuilder(client)
export const urlFor = (source) => builder.image(source)
```

> Remember to add your project id and dataset name for your current Sanity project

&nbsp;

## Fetch Sanity data

- import the `client` from `lib/client.js` in your page component:

```js
import { client } from '@/lib/client'
```

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

## **Stripe**

### Install Stripe

- `npm install stripe @stripe/stripe-js`

&nbsp;

### Setup Stripe

- create a Stripe account
- choose a Stripe Company Name (e.g. `Emanuele Favero`) and continue to the dashboard
- make sure to enable the `Test mode` so you can test the payment process without actually paying
- go to the `Developers` section and click on `API keys` ([https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys))
- copy the `Publishable key` and `Secret key` and add them to your `.env.local` file:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY='your_stripe_publishable_key'
NEXT_PUBLIC_STRIPE_SECRET_KEY='your_stripe_secret_key'
```

&nbsp;

### Create a Stripe API endpoint

> Note: You can also follow this setup guide on the Stripe docs quickstart page: [https://stripe.com/docs/checkout/quickstart](https://stripe.com/docs/checkout/quickstart)

- create a `pages/api/stripe.js` file with the following code:

```js
import Stripe from 'stripe'

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

// TIP: You can use 4242 4242 4242 4242 as a test card number with 424 as the CVC and any future date for the expiration date in the stripe checkout form for testing purposes
// TIP: Remember to set stripe to test mode in the dashboard
// TIP: You can go to the stripe settings / Business settings / Customer emails and enable "Successful payments" to send an email to the customer when the payment is successful (the email will not be sent in test mode)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // console.log(req.body)

    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',

        // Shipping options - create them in the Stripe dashboard and copy the IDs here
        // @link https://dashboard.stripe.com/test/shipping-rates
        shipping_options: [
          // FREE SHIPPING
          { shipping_rate: 'shr_1Mp2HsKA1UjcyalEY6GCZK8A' },
        ],

        line_items: req.body.map((item) => {
          // access sanity image
          // @link https://www.sanity.io/manage
          const img = item.image[0].asset._ref
          const newImage = img
            .replace(
              'image-',
              // NOTE: use sanity project id in the url
              'https://cdn.sanity.io/images/eglqvky8/production/'
            )
            .replace('-webp', '.webp') // NOTE: put .jpg or .png if you don't use webp images

          return {
            price_data: {
              currency: 'eur',
              product_data: {
                name: item.name,
                images: [newImage],
              },

              unit_amount: item.price * 100, // convert price to cents
            },

            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          }
        }),

        // ? REDIRECT URLS when stripe checkout is successful or canceled
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
        automatic_tax: { enabled: true },
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params)

      res.status(200).json(session) // return session
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message)
    }
  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method Not Allowed')
  }
}
```

> Note: Make sure you have a shipping option at [https://dashboard.stripe.com/test/shipping-rates](https://dashboard.stripe.com/test/shipping-rates)

&nbsp;

### Create an instance of Stripe

- create a `lib/getStripe.js` file with the following code:

```js
import { loadStripe } from '@stripe/stripe-js'

let stripePromise

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  }

  return stripePromise
}

export default getStripe
```

&nbsp;

### Create a checkout button

- import the `getStripe` function in your `Cart` component or whenever you need to implement a checkout button

```js
import getStripe from '../lib/getStripe'
```

- create a `handleCheckout` function that will handle the checkout process

```js
// STRIPE CHECKOUT
const handleCheckout = async () => {
  const stripe = await getStripe()

  const response = await fetch('/api/stripe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cartItems),
  })

  if (response.statusCode === 500) return

  const data = await response.json()

  toast.loading('Redirecting to checkout...')

  stripe.redirectToCheckout({ sessionId: data.id })
}
```

- create a `button` jsx element and add the `onClick` event handler

```js
<button onClick={handleCheckout}>Checkout</button>
```

&nbsp;

### Create a success page

- create a `pages/success.js` file to show a success message after the checkout process is completed

### Create a canceled page

- create a `pages/canceled.js` file to show a canceled message after the checkout process is canceled

> Note: These urls are created by Stripe in `pages/api/stripe.js`
>
> ```js
> success_url: `${req.headers.origin}/success`,
> cancel_url: `${req.headers.origin}/canceled`,
> ```

&nbsp;

---

&nbsp;

## Deploy App to Vercel

- if Vercel gives you an error from the sanity project directory (`sanity-ecommerce`), you can ignore the directory on deploy by adding a `.vercelignore` file at the root of the project and adding the `sanity-ecommerce` folder to it
- add a `.vercelignore` file in the root directory and add the `sanity-pineapple` folder to it to ignore it when deploying to Vercel
- remember to add the following environment variables to Vercel:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_TOKEN
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_SECRET_KEY
```

- add the vercel website url to the Sanity project management dashboard `API > CORS origins > + Add CORS origin`

> Here: [https://www.sanity.io/manage](https://www.sanity.io/manage) (Click on your project name)

## Deploy Sanity Studio

- `cd` into the `sanity-ecommerce` folder and run `sanity deploy` to deploy the Sanity Studio to the cloud
- choose a name for your Studio hostname (e.g. `emanuelefavero-ecommerce`)
- share the link with your team members or clients

> Note: the link for this project is: [this one](https://emanuelefavero-ecommerce.sanity.studio/desk)

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
