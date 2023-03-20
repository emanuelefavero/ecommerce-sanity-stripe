import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'

// NOTE: By using curly braces when importing react components, we only need to specify the directory where the component is located (in this case, the components directory)
import { Layout } from '@/components'

// Context Provider
import { StateContext } from '@/context/StateContext'

export default function App({ Component, pageProps }) {
  return (
    <StateContext>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </StateContext>
  )
}
