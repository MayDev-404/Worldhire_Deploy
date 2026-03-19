"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-[#1e40af]">worldhire</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors">
            Home
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors">
            About
          </Link>
          <Link href="/jobs" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors">
            Jobs
          </Link>
          <Link href="/company" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors">
            Company
          </Link>
          <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-[#1e40af] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Sign Up Buttons */}
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="hidden sm:flex" asChild>
            <Link href="/signup?type=employer">Employer Sign Up</Link>
          </Button>
          <Button className="bg-[#1e40af] hover:bg-[#1e3a8a]" asChild>
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

