import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Initialize Sanity client
export const client = createClient({
  projectId: 't44dx57v', // Replace with your actual Project ID from sanity.io/manage
  dataset: 'production',
  useCdn: false, // Disable CDN for write operations
  apiVersion: '2024-01-01',
  token: import.meta.env.VITE_SANITY_TOKEN, // Write token for submissions
})

// Helper function to generate image URLs
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}