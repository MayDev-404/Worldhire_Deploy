import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTASection() {
  return (
    <section className="py-20 px-4 bg-black text-white">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of companies and candidates who have found success with WorldHire.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/signup">Sign Up Now</Link>
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-black" size="lg" asChild>
            <Link href="/demo">Book a Demo</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

