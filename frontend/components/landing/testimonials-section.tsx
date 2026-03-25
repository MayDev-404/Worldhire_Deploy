import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Candidates */}
          <Card className="overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 relative">
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">👨</span>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3">For Candidates</h3>
              <p className="text-gray-600 mb-4">
                Discover your next career opportunity with our AI-powered job matching. 
                Find roles that align with your skills, values, and career goals.
              </p>
              <Link href="/candidates" className="text-primary font-medium flex items-center gap-2 hover:underline">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* For Recruiters */}
          <Card className="overflow-hidden">
            <div className="h-64 bg-gradient-to-br from-orange-100 to-orange-200 relative">
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                <span className="text-4xl">👩</span>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold mb-3">For Recruiters</h3>
              <p className="text-gray-600 mb-4">
                Find the perfect talent for your team with our intelligent matching system. 
                Streamline your hiring process and connect with top candidates faster.
              </p>
              <Link href="/recruiters" className="text-primary font-medium flex items-center gap-2 hover:underline">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

