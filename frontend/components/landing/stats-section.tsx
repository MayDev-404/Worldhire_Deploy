import { Card, CardContent } from "@/components/ui/card"

const stats = [
  { label: "Match Rate", value: "85%" },
  { label: "Jobs Posted", value: "10K+" },
  { label: "Companies", value: "500+" },
  { label: "Support", value: "24/7" },
]

export default function StatsSection() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Excellence is in the details</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our commitment to quality and innovation drives exceptional results 
            for both employers and job seekers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-8">
                <div className="text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

