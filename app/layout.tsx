import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ToasterProvider } from '@/components/toaster-provider'
import { ModalProvider } from '@/components/modal-provider'

import './globals.css'
import { CrispProvider } from '@/components/crisp-provider'
import { Analytics } from "@vercel/analytics/react"
import Script from 'next/script'

const font = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ctrlcap',
  description: 'Content Generation',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
    appearance={{
        variables: {
            colorPrimary: 'hsl(346.8, 77.2%, 49.8%)', // change this value (you can get it from you're css variables, make sure to include 'hsl' and commas)
                },
            }}
>
      <html lang="en" suppressHydrationWarning>
        <Analytics/>
        <CrispProvider />
        <head>

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-C1HTNXFEJG"
        />

        </head>
        <body className={font.className}>
          <ToasterProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
