import Sidebar from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"

export default function OpportunitiesPage() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Opportunities</h1>
            <p className="text-gray-600">Browse all available job opportunities.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

