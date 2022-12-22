/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // add support for Docker
  experimental: {
	  images: {
		  unoptimized: true
	  }
  }
})