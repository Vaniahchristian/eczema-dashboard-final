import { BarChart3, Calendar, Camera, LineChart, MessageSquare, ShieldCheck, Sparkles, UserCircle } from "lucide-react"

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm dark:bg-teal-900">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Manage Eczema</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              EczemaAI combines cutting-edge technology with medical expertise to provide a comprehensive eczema
              management solution.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <Camera className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">AI-Powered Analysis</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Upload photos of your skin and get instant AI analysis and severity assessment.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <LineChart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Symptom Tracking</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Track symptoms, triggers, and treatment effectiveness over time.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <Sparkles className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Personalized Recommendations</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Get personalized treatment and lifestyle recommendations based on your data.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Appointment Management</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Schedule and manage appointments with dermatologists directly in the app.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <MessageSquare className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Doctor Messaging</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Communicate with healthcare providers securely through the platform.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Detailed Analytics</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              View comprehensive analytics about your condition and treatment progress.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <UserCircle className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Community Support</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Connect with others who have eczema to share experiences and support.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <ShieldCheck className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Privacy Focused</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Your health data is encrypted and secure, with full control over your privacy.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="rounded-full bg-teal-100 p-3 dark:bg-teal-900">
              <Sparkles className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="text-xl font-bold">Educational Resources</h3>
            <p className="text-center text-gray-500 dark:text-gray-400">
              Access a library of educational content about eczema management and treatment.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

