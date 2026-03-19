import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const categories = [
  { name: "Management", jobs: 120 },
  { name: "Sales", jobs: 80 },
  { name: "Digital Marketing", jobs: 150 },
  { name: "Programming", jobs: 90 },
]

export default function PopularCategory() {
  return (
    <section className="py-16 px-4 bg-[#1e40af]">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Popular category</h2>
          <a href="#" className="text-white flex items-center gap-2 hover:underline">
            View All <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card key={index} className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-semibold text-xl mb-2">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.jobs}+ Jobs</p>
                <Button variant="outline" className="w-full">
                  View Jobs
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

