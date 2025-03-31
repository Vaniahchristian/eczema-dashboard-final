export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-teal-100 px-3 py-1 text-sm dark:bg-teal-900">Testimonials</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear from people who have transformed their eczema management with EczemaAI.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col justify-between space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-yellow-500"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                "EczemaAI has completely changed how I manage my eczema. The AI analysis is incredibly accurate, and the
                personalized recommendations have made a huge difference."
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div>
                <p className="text-sm font-medium">Sarah Johnson</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Living with eczema for 15 years</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-yellow-500"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                "As a parent of a child with eczema, this app has been a lifesaver. Being able to track triggers and
                share data with our dermatologist has improved our treatment plan."
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div>
                <p className="text-sm font-medium">Michael Rodriguez</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Parent of a child with eczema</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between space-y-4 rounded-lg border border-gray-200 p-6 shadow-sm dark:border-gray-800">
            <div className="space-y-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 text-yellow-500"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                "The ability to connect with my dermatologist through the app has been invaluable. I can share my
                progress and get feedback without unnecessary appointments."
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div>
                <p className="text-sm font-medium">Emily Chen</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Severe eczema patient</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

