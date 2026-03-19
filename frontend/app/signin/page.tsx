import SignInForm from "@/components/auth/signin-form"
import Header from "@/components/landing/header"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <SignInForm />
    </div>
  )
}
