import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 't44dx57v',
    dataset: 'production'
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: true,
  }
})
