import createNextIntlPlugin from 'next-intl/plugin'
import { NextConfig } from 'next'

const withNextIntl = createNextIntlPlugin('./src/app/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {}

export default withNextIntl(nextConfig)
