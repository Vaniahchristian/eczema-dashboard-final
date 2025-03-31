import RegisterForm from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8">
        <RegisterForm />
      </div>
    </div>
  )
}

