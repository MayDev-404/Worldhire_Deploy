"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Bell, ChevronDown, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

type DashboardHeaderProps = {
  candidateName?: string
  initials?: string
}

export default function DashboardHeader({ candidateName, initials = "CU" }: DashboardHeaderProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)

    try {
      const refreshToken =
        typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null

      if (refreshToken) {
        await apiClient.logout(refreshToken)
      }
    } catch {
      // Clear local auth state even if the backend revoke call fails.
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        localStorage.removeItem("remember_me")
        localStorage.removeItem("token")
      }

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })

      router.push("/signin")
      router.refresh()
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100">
      <div className="flex h-14 items-center justify-between px-6">
        {/* Logo on left — visible here since sidebar may be hidden on mobile */}
        <Link href="/" className="text-xl font-bold text-[#1e40af] lg:hidden">
          worldhire
        </Link>
        <div className="hidden lg:block" />

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* AI Assistant Button */}
          <Button
            className="bg-gradient-to-r from-[#1e40af] to-[#6366f1] hover:from-[#1e3a8a] hover:to-[#4f46e5] text-white text-xs font-semibold px-4 h-9 rounded-lg shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            AI Assistant
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full hover:bg-gray-50">
            <Bell className="w-[18px] h-[18px] text-gray-600" />
            <Badge className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] p-0 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 rounded-lg hover:bg-gray-50" disabled={isSigningOut}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-[#1e40af] to-[#6366f1] text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                disabled={isSigningOut}
                onSelect={() => {
                  void handleSignOut()
                }}
              >
                <LogOut className="w-4 h-4" />
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
