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
