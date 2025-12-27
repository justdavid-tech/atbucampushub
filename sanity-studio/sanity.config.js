import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'ATBU CampusHub',

  projectId: 't44dx57v', // My project ID from sanity.io dashboard
  dataset: 'production',

  plugins: [
    deskTool(),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})