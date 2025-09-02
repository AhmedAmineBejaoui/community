'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

interface ServicePost {
  id: string;
  title: string;
  content?: string;
  community: {
    slug: string;
    name: string;
  };
  author: {
    fullName: string;
  };
  createdAt: string;
  extra?: {
    priority?: string;
    serviceType?: string;
    status?: string;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServicePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        let url = '/api/posts?type=SERVICE&limit=50';
        if (selectedPriority !== 'all') {
          url += `&priority=${selectedPriority}`;
        }
        if (selectedStatus !== 'all') {
          url += `&status=${selectedStatus}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setServices(data.data);
        }
      } catch (error) {
        console.error('Failed to load services');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [selectedPriority, selectedStatus]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="container-page flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <PageHeader
        title="Community Services"
        description="Find and offer services in your neighborhood"
      />

      {/* Filters */}
      <div className="card mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <label
              htmlFor="priority-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Priority
            </label>
            <select
              id="priority-filter"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="all">All Priorities</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="status-filter"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="all">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services List */}
      {services.length > 0 ? (
        <div className="space-y-6">
          {services.map((service) => (
            <div key={service.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">🤝</span>
                      <div className="flex gap-2">
                        {service.extra?.priority && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(service.extra?.priority)}`}>
                            {service.extra?.priority}
                          </span>
                        )}
                        {service.extra?.status && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.extra?.status)}`}>
                            {service.extra?.status}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/c/${service.community.slug}/posts/${service.id}`} className="hover:text-blue-600">
                        {service.title}
                      </Link>
                    </h3>
                    
                    {service.content && (
                      <p className="text-gray-600 mb-4">{service.content}</p>
                    )}
                    
                    {service.extra?.serviceType && (
                      <p className="text-sm text-gray-500 mb-3">
                        <strong>Service Type:</strong> {service.extra?.serviceType}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>by {service.author.fullName}</span>
                        <span>in {service.community.name}</span>
                      </div>
                      <span>{new Date(service.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤝</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-6">
              {selectedPriority !== 'all' || selectedStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'No service requests have been posted yet.'
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
