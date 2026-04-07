import type { Metadata, Viewport } from 'next'
import { Inter, Press_Start_2P } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { RewardToast } from '@/components/reward-toast'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const pressStart2P = Press_Start_2P({ 
  weight: "400",
  subsets: ["latin"],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PlantCraft - Gamified Plant Care',
  description: 'Take care of your plants with AR and gamification. Earn coins, level up, and decorate your plants!',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#5C8A3C',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${pressStart2P.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <RewardToast />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
