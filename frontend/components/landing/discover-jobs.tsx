import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

const roles = [
  "Full Stack Developer",
  "Front End Developer",
  "Technical Lead",
  "Technical Architect",
  "Business Analyst",
  "Recruitment Consultant",
]

export default function DiscoverJobs() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-8">
          <h2 className="text-3xl font-bold mb-4">Discover jobs across popular roles</h2>
          <p className="text-gray-600">
            Explore opportunities in the most in-demand roles across various industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{role}</h3>
                  <p className="text-sm text-gray-600 mt-1">50+ Jobs</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </section>
  )
}

