import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Initialize Sanity client
export const client = createClient({
  projectId: 't44dx57v', // Replace with your actual Project ID from sanity.io/manage
  dataset: 'production',
  useCdn: true, // Use CDN for faster response
  apiVersion: '2024-01-01',
})

// Helper function to generate image URLs
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}