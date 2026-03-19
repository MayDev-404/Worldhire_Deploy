import CandidateApplicationForm from "@/components/candidate-application-form"

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Apply for a Position</h1>
        <CandidateApplicationForm />
      </div>
    </div>
  )
}

