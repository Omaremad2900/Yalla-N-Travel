import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white text-slate-700 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-700">
            About <span className="text-slate-500">Yalla</span><span className="text-slate-700">n'Travel</span>
          </h1>
          <p className="text-xl mb-8 text-slate-500">
            We are passionate about creating unforgettable travel experiences.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-700">Our Mission</h2>
          <p className="text-lg text-slate-500 mb-12">
            At Yalla n'Travel, our mission is to make travel accessible, seamless, and memorable for everyone. We aim to
            connect travelers with unique experiences that leave a lasting impact.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Personalized Planning</h3>
              <p className="text-slate-500 mt-2">
                Tailor every aspect of your trip to suit your tastes, interests, and budget.
              </p>
            </div>
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Global Destinations</h3>
              <p className="text-slate-500 mt-2">
                Discover hidden gems and popular spots in over 100 countries.
              </p>
            </div>
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Sustainable Travel</h3>
              <p className="text-slate-500 mt-2">
                We support eco-friendly and community-based tourism initiatives worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-200 text-slate-700 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-700">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-700">Customer First</h3>
              <p className="text-slate-500 mt-2">
                We prioritize creating exceptional experiences tailored to each traveler.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-700">Integrity</h3>
              <p className="text-slate-500 mt-2">
                We believe in transparency, fair pricing, and honest communication.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-700">Innovation</h3>
              <p className="text-slate-500 mt-2">
                We continuously improve our services to bring you the best travel technology.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-700">Why Yalla n'Travel?</h2>
          <p className="text-lg text-slate-500 mb-12">
            We’re here to simplify your travel planning process and enrich your adventures. With Yalla n'Travel, you can
            explore, connect, and create memories that last a lifetime.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Exceptional Support</h3>
              <p className="text-slate-500 mt-2">
                Our support team is here to assist you at every step of your journey.
              </p>
            </div>
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Local Expertise</h3>
              <p className="text-slate-500 mt-2">
                Connect with local guides for authentic cultural experiences.
              </p>
            </div>
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Trusted Partnerships</h3>
              <p className="text-slate-500 mt-2">
                We collaborate with reputable partners to ensure safe and enjoyable travels.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-700 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; 2024 Yalla n'Travel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
