import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function FeaturesSection() {
  return (
    <>
      {/* We're always here section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                We're always here. Employees come and go.
              </h2>
              <p className="text-gray-600 mb-6">
                Build a sustainable hiring pipeline that keeps your team strong, 
                even when team members move on. Our platform ensures you're always 
                connected to top talent.
              </p>
              <div className="flex gap-4">
                <Button>Start Hiring</Button>
                <Button variant="outline">Book a demo</Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-4xl">📱</span>
                  </div>
                  <p className="text-gray-600">Smart Hiring Platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Career Love section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">AI Career Love</h2>
              <p className="text-gray-600 mb-6">
                Experience smart matching powered by AI. Our advanced algorithms 
                analyze skills, experience, and cultural fit to connect you with 
                the perfect opportunities or candidates.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md h-64 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-4xl">🤖</span>
                  </div>
                  <p className="text-gray-600">AI-Powered Matching</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Made Simple section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Collaboration made simple</h2>
              <p className="text-gray-600 mb-6">
                Streamline your hiring process with our intuitive collaboration tools. 
                Work seamlessly with your team to find, evaluate, and hire the best talent.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-md h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
                    <span className="text-4xl">💻</span>
                  </div>
                  <p className="text-gray-600">Team Collaboration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

