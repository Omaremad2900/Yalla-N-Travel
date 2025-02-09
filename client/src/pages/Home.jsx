import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-slate-200 text-slate-700 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-slate-700">
            Welcome to <span className="text-slate-500">Yalla</span><span className="text-slate-700">n'Travel</span>
          </h1>
          <p className="text-xl mb-8 text-slate-500">
            Your ultimate travel companion for unforgettable experiences.
          </p>
          <Link
            to="/TouristDashboard"
            className="bg-slate-700 text-white px-8 py-3 rounded-md hover:bg-slate-500 transition-colors"
          >
            Start Your Journey
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-700">Explore Destinations</h2>
          <p className="text-lg text-slate-500 mb-12">
            Discover new places, create personalized itineraries, and enjoy seamless travel planning.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Top Tourist Attractions</h3>
              <p className="text-slate-500 mt-2">
                Explore the most iconic landmarks and hidden gems around the world.
              </p>
            </div>
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Personalized Itineraries</h3>
              <p className="text-slate-500 mt-2">
                Create and customize your own itinerary based on your preferences.
              </p>
            </div>
            <div className="bg-slate-200 rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-semibold text-slate-700">Local Experiences</h3>
              <p className="text-slate-500 mt-2">
                Immerse yourself in authentic cultural experiences with local guides.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-200 text-slate-700 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-700">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-700">Seamless Booking</h3>
              <p className="text-slate-500 mt-2">
                Book flights, hotels, and activities effortlessly all in one place.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-700">Smart Budgeting</h3>
              <p className="text-slate-500 mt-2">
                Plan your trip within your budget with our smart tools and tips.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-slate-700">Real-Time Updates</h3>
              <p className="text-slate-500 mt-2">
                Get real-time notifications for flight updates, hotel bookings, and more.
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
