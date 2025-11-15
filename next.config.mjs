import withPWA from '@ducanh2912/next-pwa'

export default withPWA({
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: false
  }
})