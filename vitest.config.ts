/* eslint-disddable */
import path from 'node:path'

export default {
  test: {
    globals: true,
    coverage: {
      reporter: ['json-summary'],
      include: ['src/**/*.ts'],
      exclude: ['src/utils/*', 'src/database/*', 'src/services/*']
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests')
    }
  }
}
