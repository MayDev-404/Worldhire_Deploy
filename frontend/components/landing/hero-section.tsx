"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Star } from "lucide-react"

const jobCards = [
  { title: "Technical Support Specialist", color: "bg-green-100", icon: "💼" },
  { title: "Marketing Officer", color: "bg-pink-100", icon: "📊" },
  { title: "Marketing Officer", color: "bg-blue-100", icon: "📈" },
  { title: "Technical Support Specialist", color: "bg-orange-100", icon: "🔧" },
]

export default function HeroSection() {
  return (
    <section className="relative py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Job Cards - Left Side */}
        <div className="absolute left-0 top-20 hidden lg:block space-y-4">
          <Card className={`w-64 ${jobCards[0].color} border-none shadow-lg`}>
            <CardContent className="p-4">
              <div className="text-2xl mb-2">{jobCards[0].icon}</div>
              <h3 className="font-semibold mb-1">{jobCards[0].title}</h3>
              <p className="text-sm text-gray-600 mb-3">Full-time • Remote</p>
              <Button size="sm" variant="outline">View Job</Button>
            </CardContent>
          </Card>
          <Card className={`w-64 ${jobCards[1].color} border-none shadow-lg`}>
            <CardContent className="p-4">
              <div className="text-2xl mb-2">{jobCards[1].icon}</div>
              <h3 className="font-semibold mb-1">{jobCards[1].title}</h3>
              <p className="text-sm text-gray-600 mb-3">Full-time • On-site</p>
              <Button size="sm" variant="outline">View Job</Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Star Icon */}
          <div className="flex items-center justify-center mb-4">
            <Star className="w-5 h-5 text-primary fill-primary" />
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            From Job Posting to{" "}
            <span className="text-primary">Perfect Match</span>. All in One Workflow
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience seamless hiring with AI-powered matching and streamlined workflow. 
            Connect with top talent and find your perfect role faster than ever.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search Job"
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button className="h-12 px-8">
                Find Job
              </Button>
            </div>
          </div>

          {/* Suggested */}
          <p className="text-sm text-gray-500">
            Suggested: Manager, Designer, Developer, Remote
          </p>
        </div>

        {/* Job Cards - Right Side */}
        <div className="absolute right-0 top-20 hidden lg:block space-y-4">
          <Card className={`w-64 ${jobCards[2].color} border-none shadow-lg`}>
            <CardContent className="p-4">
              <div className="text-2xl mb-2">{jobCards[2].icon}</div>
              <h3 className="font-semibold mb-1">{jobCards[2].title}</h3>
              <p className="text-sm text-gray-600 mb-3">Full-time • Hybrid</p>
              <Button size="sm" variant="outline">View Job</Button>
            </CardContent>
          </Card>
          <Card className={`w-64 ${jobCards[3].color} border-none shadow-lg`}>
            <CardContent className="p-4">
              <div className="text-2xl mb-2">{jobCards[3].icon}</div>
              <h3 className="font-semibold mb-1">{jobCards[3].title}</h3>
              <p className="text-sm text-gray-600 mb-3">Full-time • Remote</p>
              <Button size="sm" variant="outline">View Job</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

