"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  Briefcase,
  Mail,
} from "lucide-react"
import type { Candidate } from "@/types/candidate"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/opportunities", label: "Opportunities", icon: Briefcase },
  { href: "/dashboard/inbox", label: "Inbox", icon: Mail },
]

const STATUS_OPTIONS = ["Active", "Passive", "Discreet"] as const

const STATUS_MESSAGES: Record<string, string> = {
  Active: "Actively looking · Your profile is highly visible to recruiters",
  Passive: "Open to opportunities · Your profile is visible to select recruiters",
  Discreet: "Discreet · Your profile is hidden from recruiters",
}

type SidebarProps = {
  candidate?: Candidate
  initials?: string
  onStatusChange?: (status: string) => void
}

export default function Sidebar({ candidate, initials = "CU", onStatusChange }: SidebarProps) {
  const pathname = usePathname()
  const status = candidate?.actively_seeking_toggle || "Active"

  return (
    <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-100 h-screen sticky top-0 flex flex-col">
      {/* User Profile Card */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <Avatar className="w-11 h-11">
            {candidate?.photograph_url ? (
              <img src={candidate.photograph_url} alt={candidate.name} className="h-full w-full object-cover" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-[#1e40af] to-[#6366f1] text-white text-sm font-semibold">
                {initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{candidate?.name || "Candidate"}</p>
            <p className="text-xs text-gray-400 truncate">{candidate?.email || ""}</p>
          </div>
        </div>

        {/* Job Search Status */}
        <div className="space-y-3">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Job Search Status</p>
          <div className="flex gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => onStatusChange?.(opt)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  status === opt
                    ? "bg-[#22c55e] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            <span className="text-[#22c55e] font-semibold">
              {status === "Active" ? "Actively looking" : status === "Passive" ? "Open to opportunities" : "Discreet"}
            </span>
            {" · "}
            {status === "Active"
              ? "Your profile is highly visible to recruiters"
              : status === "Passive"
                ? "Visible to select recruiters"
                : "Your profile is hidden from recruiters"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-[#1e40af] text-white font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 font-medium"
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logo at bottom */}
      <div className="p-5 border-t border-gray-100">
        <Link href="/" className="text-xl font-bold text-[#1e40af]">
          worldhire
        </Link>
      </div>
    </aside>
  )
}
