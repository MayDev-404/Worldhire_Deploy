"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function FloatingButton() {
  return (
    <Button
      className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-gradient-to-r from-primary to-[#6366f1] hover:from-primary/90 hover:to-[#4f46e5] text-white shadow-xl z-50 transition-transform hover:scale-105"
      size="icon"
    >
      <Plus className="w-5 h-5" />
    </Button>
  )
}
