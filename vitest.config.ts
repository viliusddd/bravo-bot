/* eslint-disddable */
import path from 'node:path'

export default {
  test: {
    globals: true,
    coverage: {
      reporter: ['json'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/utils/*',
        'src/database/*',
        'src/services/*',
        'src/modules/**/tests/*.ts'
      ]
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests')
    }
  }
}
