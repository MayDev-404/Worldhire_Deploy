"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteLogo } from "@/components/brand/site-logo"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <SiteLogo priority imgClassName="h-8 sm:h-9 w-auto max-w-[200px]" />

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/jobs" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Jobs
          </Link>
          <Link href="/company" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Company
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Sign Up Buttons */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="hidden sm:flex" asChild>
            <Link href="/signup?type=employer">Employer Sign Up</Link>
          </Button>
          <Button asChild>
            <Link href="/signup?type=candidate">Candidate Sign Up</Link>
          </Button>
          <Button variant="ghost" className="hidden md:flex" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

