import React, { useState } from 'react';
import { Search, Instagram, Facebook, ArrowLeft } from 'lucide-react';

const API_URL = 'https://ad-research-api.onrender.com';

const AdResearchDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [advertisers, setAdvertisers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageAds, setPageAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);

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
      const response = await fetch(
        `${API_URL}/api/search-advertisers?query=${encodeURIComponent(searchQuery)}&country_code=${selectedCountry}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const data = await response.json();
      setAdvertisers(data.results || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAds = async (page) => {
    setSelectedPage(page);
    setLoadingAds(true);

    try {
      const response = await fetch(
        `${API_URL}/api/page-ads/${page.id}?country_code=${selectedCountry}&platform=facebook,instagram&media_types=all&active_status=all`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch ads');
      }
      const data = await response.json();
      setPageAds(data.results.flat());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAds(false);
    }
  };

  const renderSearchResults = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {advertisers.map(advertiser => (
        <div 
          key={advertiser.id} 
          className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
          onClick={() => handleViewAds(advertiser)}
        >
          <div className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {advertiser.name}
                  {advertiser.verification === "blue_verified" && (
                    <span className="inline-block ml-1 text-blue-500">✓</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">{advertiser.category}</p>
              </div>
              {advertiser.imageURI && (
                <img 
                  src={advertiser.imageURI} 
                  alt={advertiser.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">
                  {advertiser.likes?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-500">FB Likes</div>
              </div>
              <div className="text-center p-2 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">
                  {advertiser.igFollowers?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-500">IG Followers</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAdList = () => (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={() => setSelectedPage(null)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <ArrowLeft size={16} />
            Back to results
          </button>
          <h2 className="text-xl font-bold">{selectedPage.name} Ads</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{pageAds.length}</div>
            <div className="text-sm text-gray-600">Total Ads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {pageAds.filter(ad => ad.publisherPlatform?.includes('facebook')).length}
            </div>
            <div className="text-sm text-gray-600">Facebook Ads</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {pageAds.filter(ad => ad.publisherPlatform?.includes('instagram')).length}
            </div>
            <div className="text-sm text-gray-600">Instagram Ads</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pageAds.map(ad => (
          <div key={ad.adArchiveID} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              {ad.snapshot.videos?.[0] && (
                <video 
                  controls 
                  poster={ad.snapshot.videos[0].video_preview_image_url}
                  className="w-full mb-4 rounded-lg"
                >
                  <source src={ad.snapshot.videos[0].video_sd_url} type="video/mp4" />
                </video>
              )}
              {ad.snapshot.images?.[0] && (
                <img 
                  src={ad.snapshot.images[0].original_image_url}
                  alt="Ad creative"
                  className="w-full mb-4 rounded-lg"
                />
              )}
              <div className="space-y-2">
                <div className="font-medium">{ad.snapshot.title || ad.snapshot.body?.markup?.__html}</div>
                <div className="text-sm text-gray-500">
                  Started: {new Date(ad.startDate * 1000).toLocaleDateString()}
                </div>
                {ad.snapshot.cta_text && (
                  <button 
                    onClick={() => window.open(ad.snapshot.link_url, '_blank')}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    {ad.snapshot.cta_text}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex justify-center items-start py-8 w-screen">
      <div className="container mx-auto max-w-7xl p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Ad Research Platform
          </h1>

          {!selectedPage && (
            <div className="mb-6 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search advertisers..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  />
                  <button 
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>
              </div>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="border rounded-lg px-4 py-2 bg-white"
              >
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Searching advertisers...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Error: {error}</p>
              <button 
                onClick={handleSearch} 
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && selectedPage ? (
            loadingAds ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading ads...</p>
              </div>
            ) : (
              renderAdList()
            )
          ) : (
            !loading && !error && advertisers.length > 0 && renderSearchResults()
          )}

          {!loading && !error && advertisers.length === 0 && searchQuery && (
            <div className="text-center py-12 text-gray-600">
              No advertisers found for your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdResearchDashboard;
