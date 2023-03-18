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
