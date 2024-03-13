import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { ToasterProvider } from '@/components/toaster-provider'
import { ModalProvider } from '@/components/modal-provider'

import './globals.css'
import { CrispProvider } from '@/components/crisp-provider'
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <CrispProvider />
        <head>

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-C1HTNXFEJG"
        />

        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', G-C1HTNXFEJG);
          `}
        </Script>
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
