import path from 'path'
import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    loadPaths: [path.resolve('node_modules/@payloadcms/ui/dist/scss/')],
  },
}

export default withPayload(nextConfig)
