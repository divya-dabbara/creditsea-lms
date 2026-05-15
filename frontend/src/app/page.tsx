import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function Home() {
  return (
    <div className="relative isolate h-[calc(100vh-64px)] flex items-center bg-white overflow-hidden">
      {/* Decorative background element top */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#90cdf4] to-[#3182ce] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.187rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-12 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Modern Loan Management for the Next Generation
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A seamless, transparent, and secure platform to manage loan applications, sanctions, disbursements, and collections. Experience professional-grade lending automation.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/register">
                <Button size="lg" className="px-8 shadow-md">Get Started</Button>
              </Link>
              <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors">
                Existing user login <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative background element bottom */}
      <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80">
        <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#90cdf4] to-[#3182ce] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.187rem]" />
      </div>
    </div>
  );
}
