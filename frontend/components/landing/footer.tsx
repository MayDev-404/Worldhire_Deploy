import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-white border-t">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              WorldHire
            </Link>
          </div>
          <div className="text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} WorldHire. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

