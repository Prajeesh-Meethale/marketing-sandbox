"use client";

import { useState } from "react";

export function InvestigationForm({ onSubmit, isLoading }: { onSubmit: (data: { companyName: string, websiteUrl: string }) => void, isLoading: boolean }) {
  const [companyName, setCompanyName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Brief Jordan</h2>
      
      <form onSubmit={(e) => { e.preventDefault(); onSubmit({ companyName, websiteUrl }); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
          <input 
            type="text" 
            required 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="e.g. Apsara Ice Creams"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website URL (Optional)</label>
          <input 
            type="url" 
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            placeholder="e.g. https://apsaraicecreams.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
        >
          {isLoading ? "Jordan is Inferring Context..." : "Have Jordan Investigate"}
        </button>
      </form>
    </div>
  );
}
