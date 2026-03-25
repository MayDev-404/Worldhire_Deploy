const companies = [
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Netflix",
  "Tesla",
  "Spotify",
  "Adobe",
  "Salesforce",
  "Google",
]

export default function CompanyLogos() {
  return (
    <section className="py-12 bg-primary">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center flex-wrap gap-8 md:gap-12">
          {companies.map((company, index) => (
            <div
              key={index}
              className="text-white font-semibold text-lg opacity-80 hover:opacity-100 transition-opacity"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

