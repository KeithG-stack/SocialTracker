import Link from 'next/link';
import React from 'react';

export default function LandingPage() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white shadow py-6 px-8">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Social Dashboard</h1>
          <nav>
            <Link href="/#features" className="text-gray-700 hover:text-indigo-600 mr-4">Features</Link>
            <Link href="/#pricing" className="text-gray-700 hover:text-indigo-600 mr-4">Pricing</Link>
            <Link href="/#contact" className="text-gray-700 hover:text-indigo-600">Contact</Link>
            <Link href="/dashboard" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto py-16 px-8 flex flex-col md:flex-row items-center justify-center flex-1">
        <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 md:mr-12">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Unlock Unified Social Media Management
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Stop juggling multiple platforms. Our Next.js dashboard provides real-time analytics, collaboration tools, and AI-powered insights to supercharge your social media strategy.
          </p>
          <Link href="/dashboard" className="bg-indigo-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-indigo-700">
            Get Started for Free
          </Link>
        </div>
        <div className="md:w-1/2">
          {/* Replace with a compelling image or video showcasing the dashboard */}
          <div className="bg-indigo-100 rounded-lg p-8">
            <p className="text-center text-gray-500 italic">Image/Video Placeholder</p>
          </div>
        </div>
      </main>

      <section id="features" className="bg-gray-50 py-16 px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Multi-platform Integration</h3>
              <p className="text-gray-700">Connect Instagram, Twitter, Facebook, and LinkedIn securely.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Real-time Analytics</h3>
              <p className="text-gray-700">Visualize key metrics with customizable widgets.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Team Collaboration</h3>
              <p className="text-gray-700">Streamline workflows with approvals and content calendars.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">AI-Enhanced Insights</h3>
              <p className="text-gray-700">Get content recommendations and sentiment analysis.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Real-time Notifications</h3>
              <p className="text-gray-700">Instant alerts for engagement events.</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Customizable Dashboard</h3>
              <p className="text-gray-700">Drag-and-drop widgets to personalize your view.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-16 px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">Pricing</h2>
          <p className="text-lg text-gray-700 mb-6">Simple and flexible pricing plans to fit your needs.</p>
          {/* Add your pricing tiers here */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">Basic</h4>
              <p className="text-gray-700 mb-4">$19/month</p>
              <ul className="list-disc list-inside text-gray-700 mb-4">
                <li>Up to 3 social profiles</li>
                <li>Basic analytics</li>
                <li>Content scheduling</li>
              </ul>
              <Link href="/dashboard" className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                Get Started
              </Link>
            </div>
            {/* More pricing tiers */}
          </div>
        </div>
      </section>

      <section id="contact" className="bg-gray-100 py-16 px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">Contact Us</h2>
          <p className="text-lg text-gray-700 mb-6">Have questions? Reach out to our team.</p>
          {/* Add a contact form or contact information here */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-gray-700">Email: support@socialdashboard.com</p>
            <p className="text-gray-700">Phone: (555) 123-4567</p>
          </div>
        </div>
      </section>

      <footer className="bg-gray-200 py-4 px-8 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} Social Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}