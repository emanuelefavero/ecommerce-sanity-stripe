import '@/styles/globals.css'

// NOTE: By using curly braces when importing react components, we only need to specify the directory where the component is located (in this case, the components directory)
import { Layout } from '@/components'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
