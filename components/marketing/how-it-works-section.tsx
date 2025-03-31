export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm dark:bg-teal-900">How It Works</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Simple Steps to Better Eczema Management
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              EczemaAI makes it easy to track, analyze, and manage your eczema with just a few simple steps.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-900 dark:bg-teal-900 dark:text-teal-100">
              1
            </div>
            <h3 className="text-xl font-bold">Sign Up & Set Up</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Create your account and complete your profile with information about your eczema history and triggers.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-900 dark:bg-teal-900 dark:text-teal-100">
              2
            </div>
            <h3 className="text-xl font-bold">Track & Upload</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Log your symptoms daily and upload photos of affected areas for AI analysis and progress tracking.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-xl font-bold text-teal-900 dark:bg-teal-900 dark:text-teal-100">
              3
            </div>
            <h3 className="text-xl font-bold">Get Insights & Improve</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Receive personalized recommendations, connect with doctors, and see your progress over time.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

