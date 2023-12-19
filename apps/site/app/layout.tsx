import { Analytics } from '@vercel/analytics/react'
import type { Metadata } from 'next'
import { fragmentMono } from './fonts/fonts'
import { Providers } from './providers/providers'
import { Header } from '@/client'
import { Toaster } from 'sonner'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'River',
  description: 'Set information free',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${fragmentMono.variable}`}>
      <body>
        <Providers>
          <div className="">
            <div className='py-5 border-b-[0.5px] border-black'>     
              <div className='px-5'>                
                <Header />
              </div>       
            </div>
            {children}
            <Toaster position="bottom-center" />
          </div>
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
