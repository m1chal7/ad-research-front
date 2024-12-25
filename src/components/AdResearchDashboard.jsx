import React, { useState } from 'react';
import { Search, Instagram, Facebook, Users, Activity } from 'lucide-react';

const API_URL = 'https://ad-research-api.onrender.com';

const AdResearchDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'PL', name: 'Poland' },
    { code: 'GB', name: 'United Kingdom' },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const url = `${API_URL}/api/search-advertisers?query=${encodeURIComponent(searchQuery)}&country_code=${selectedCountry}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setAdvertisers(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-start py-8 w-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ad Research Platform
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search and analyze advertisers across different platforms
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex gap-4 items-center bg-white p-2 rounded-lg shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search advertisers..."
                className="w-full pl-10 pr-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-4 py-3 rounded-md border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Searching advertisers...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 p-4 rounded-lg inline-block">
              <p className="text-red-600">Error: {error}</p>
              <button
                onClick={handleSearch}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisers.map(advertiser => (
              <div key={advertiser.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        {advertiser.name}
                        {advertiser.verification === "blue_verified" && (
                          <span className="ml-1 text-blue-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                            </svg>
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{advertiser.category}</p>
                    </div>
                    {advertiser.imageURI && (
                      <img 
                        src={advertiser.imageURI} 
                        alt={advertiser.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                      />
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {advertiser.likes?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-gray-600">FB Likes</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-xl font-bold text-gray-900">
                        {advertiser.igFollowers?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-gray-600">IG Followers</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-center">
                    {advertiser.id && (
                      <a
                        href={`https://facebook.com/${advertiser.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <Facebook size={16} className="mr-2" />
                        Profile
                      </a>
                    )}
                    {advertiser.igUsername && (
                      <a
                        href={`https://instagram.com/${advertiser.igUsername}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-pink-50 text-pink-600 rounded-md hover:bg-pink-100 transition-colors"
                      >
                        <Instagram size={16} className="mr-2" />
                        Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && advertisers.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-600">No advertisers found for your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdResearchDashboard;