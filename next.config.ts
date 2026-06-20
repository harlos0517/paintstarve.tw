import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  // Your Next.js config here
}

// Make sure you wrap your `nextConfig`
// with the `withPayload` plugin
export default withPayload(nextConfig) 
