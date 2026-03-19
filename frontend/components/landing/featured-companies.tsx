import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

const companies = [
  {
    name: "Amgen Inc",
    rating: 4.8,
    reviews: 1200,
    jobs: 120,
    logo: "🧬",
  },
  {
    name: "Reliance Retail",
    rating: 4.5,
    reviews: 800,
    jobs: 80,
    logo: "🏪",
  },
  {
    name: "J.P.Morgan Chase Bank",
    rating: 4.7,
    reviews: 1500,
    jobs: 150,
    logo: "🏦",
  },
  {
    name: "Optum",
    rating: 4.6,
    reviews: 950,
    jobs: 90,
    logo: "🏥",
  },
]

export default function FeaturedCompanies() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured companies actively hiring</h2>
          <Button variant="outline">View all companies</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {companies.map((company, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-4xl mb-4">{company.logo}</div>
                <h3 className="font-semibold text-lg mb-2">{company.name}</h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">
                    {company.rating} ({company.reviews.toLocaleString()} reviews)
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{company.jobs}+ Jobs</p>
                <Button className="w-full" variant="outline">
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

