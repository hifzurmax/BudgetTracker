import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ToastProvider } from '@/components/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Budget Tracker — Manage Your Spending',
  description: 'A simple, clean single-budget expense tracker. Add your budget, track expenses, and stay on top of your finances.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen`}>
        <ToastProvider>
          <Navbar />
          <main className="pt-16 pb-12 min-h-screen">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  )
}
