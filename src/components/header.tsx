import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-2xl">
          PMTools.pro
        </Link>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/tools/calculator" className="hover:text-primary">
              Calculator
            </Link>
            <Link href="/tools/time-tracker" className="hover:text-primary">
              Time Tracker
            </Link>
            <Link href="/tools/estimation" className="hover:text-primary">
              Estimation
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}