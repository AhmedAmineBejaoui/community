'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ListingPost {
  id: string;
  title: string;
  content?: string;
  images: string[];
  community: {
    slug: string;
    name: string;
  };
  author: {
    fullName: string;
  };
  createdAt: string;
  extra: {
    price?: number;
    condition?: string;
    availability?: string;
  };
}

export default function MarketPage() {
  const [listings, setListings] = useState<ListingPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000 });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let url = '/api/posts?type=LISTING&limit=50';
        if (selectedCondition !== 'all') {
          url += `&condition=${selectedCondition}`;
        }
        if (selectedAvailability !== 'all') {
          url += `&availability=${selectedAvailability}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          let filteredListings = data.data;
          
          // Filter by price range
          if (priceRange.min > 0 || priceRange.max < 1000) {
            filteredListings = filteredListings.filter((listing: ListingPost) => {
              const price = listing.extra.price || 0;
              return price >= priceRange.min && price <= priceRange.max;
            });
          }
          
          setListings(filteredListings);
        }
      } catch (error) {
        console.error('Failed to load listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchListings();
  }, [selectedCondition, selectedAvailability, priceRange]);

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'NEW':
        return 'bg-green-100 text-green-800';
      case 'LIKE_NEW':
        return 'bg-blue-100 text-blue-800';
      case 'GOOD':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAIR':
        return 'bg-orange-100 text-orange-800';
      case 'POOR':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'SOLD':
        return 'bg-red-100 text-red-800';
      case 'RENTED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Community Marketplace</h1>
            <p className="mt-2 text-gray-600">Buy, sell, and trade items with your neighbors</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="condition-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                id="condition-filter"
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="input-field"
              >
                <option value="all">All Conditions</option>
                <option value="NEW">New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
                <option value="POOR">Poor</option>
              </select>
            </div>

            <div>
              <label htmlFor="availability-filter" className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select
                id="availability-filter"
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="input-field"
              >
                <option value="all">All Items</option>
                <option value="AVAILABLE">Available</option>
                <option value="SOLD">Sold</option>
                <option value="RENTED">Rented</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price
              </label>
              <input
                type="number"
                placeholder="0"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price
              </label>
              <input
                type="number"
                placeholder="1000"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 1000 }))}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {listings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing.id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Image Placeholder */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  {listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-4xl">🏷️</span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    {listing.extra.condition && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(listing.extra.condition)}`}>
                        {listing.extra.condition}
                      </span>
                    )}
                    {listing.extra.availability && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(listing.extra.availability)}`}>
                        {listing.extra.availability}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    <Link href={`/c/${listing.community.slug}/posts/${listing.id}`} className="hover:text-blue-600">
                      {listing.title}
                    </Link>
                  </h3>

                  {listing.content && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{listing.content}</p>
                  )}

                  {listing.extra.price !== undefined && (
                    <div className="text-2xl font-bold text-green-600 mb-3">
                      ${listing.extra.price.toFixed(2)}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>by {listing.author.fullName}</span>
                    <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="mt-3 text-sm text-gray-500">
                    in {listing.community.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-600 mb-6">
              {selectedCondition !== 'all' || selectedAvailability !== 'all' || priceRange.min > 0 || priceRange.max < 1000
                ? 'Try adjusting your filters'
                : 'No items have been listed for sale yet.'
              }
            </p>
            <Link href="/" className="btn-primary">
              Browse Communities
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
