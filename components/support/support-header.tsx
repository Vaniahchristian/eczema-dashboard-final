"use client"

export default function SupportHeader() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-teal-500 opacity-90"></div>
      
      {/* Decorative elements */}
      <div className="relative px-8 py-16">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
          Need Help?
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-100">
          Our support team is here to help you with any questions or concerns
        </p>
      </div>
    </div>
  )
}
