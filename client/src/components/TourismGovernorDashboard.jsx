import React from 'react';
import { Link } from 'react-router-dom';

const TourismGovernor = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-slate-200 p-4 h-screen">
        <h2 className="text-xl font-bold mb-4">Tourism Governor Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <Link to="/add-place" className="w-full text-left p-2 rounded hover:bg-slate-300">
              Add/Edit Place
            </Link>
          </li>
          <li>
            <Link to="/museums" className="w-full text-left p-2 rounded hover:bg-slate-300">
              View Museums
            </Link>
          </li>
          <li>
            <Link to="/historical-places" className="w-full text-left p-2 rounded hover:bg-slate-300">
              View Historical Places
            </Link>
          </li>
        </ul>
      </aside>

      {/* Content will be rendered here based on routing */}
      <div className="w-3/4 p-4">
        <h3>Select an option from the menu</h3>
      </div>
    </div>
  );
};

export default TourismGovernor;
