import React from "react";
import { useNavigate } from "react-router-dom";

export default function ComplaintsCard({ complaint, idx }) {
    const navigate = useNavigate();

    return (
        <div className="relative complaint-card">
            <div key={idx} className="max-w-sm bg-slate-200 border border-gray-200 rounded-lg shadow dark:bg-slate-200 dark:border-gray-700">

                <div className="p-5">
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-blue-800 dark:text-white">{complaint.title}</h5>
                    <p className="mb-3 font-normal text-gray-700 dark:text-slate-500">Status: {complaint.status}</p>

                    <button
                        onClick={() => navigate(`/complaintDetails/${complaint._id}`)}
                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300"
                    >
                        View Details
                        <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
