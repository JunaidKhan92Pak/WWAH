'use client';

import { useState, useMemo } from 'react';
import { Application, FilterOptions } from '@/types/application';
import { mockApplications } from '@/data/mockData';
// import { ApplicationsTable } from '@/components/ApplicationsTable';
// import { FiltersDrawer } from '@/components/FiltersDrawer';
// import { AddApplicationModal } from '@/components/AddApplicationModal';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { FiltersDrawer } from './components/FiltersDrawer';
import { AddApplicationModal } from './components/AddApplicationModal';
import { ApplicationsTable } from './components/ApplicationsTable';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    preferredCountry: '',
    universityName: '',
    degreeLevel: '',
    applicationStatus: ''
  });

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = 
        app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.emailAddress.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = 
        (!filters.preferredCountry || app.preferredCountry === filters.preferredCountry) &&
        (!filters.universityName || app.universityName === filters.universityName) &&
        (!filters.degreeLevel || app.degreeLevel === filters.degreeLevel) &&
        (!filters.applicationStatus || app.applicationStatus === filters.applicationStatus);

      return matchesSearch && matchesFilters;
    });
  }, [applications, searchTerm, filters]);

  const handleEdit = (application: Application) => {
    console.log('Edit application:', application);
    // Implement edit functionality
  };

  const handleDownload = (application: Application) => {
    console.log('Download application:', application);
    // Implement download functionality
  };

  const handleDelete = (application: Application) => {
    if (confirm('Are you sure you want to delete this application?')) {
      setApplications(prev => prev.filter(app => app.id !== application.id));
    }
  };

  const handleAddApplication = (newApplication: Omit<Application, 'id'>) => {
    const application: Application = {
      ...newApplication,
      id: Date.now().toString()
    };
    setApplications(prev => [...prev, application]);
  };

  const handleApplyFilters = () => {
    // Filters are applied automatically through the filteredApplications memo
    console.log('Filters applied:', filters);
  };

  const handleClearFilters = () => {
    setFilters({
      preferredCountry: '',
      universityName: '',
      degreeLevel: '',
      applicationStatus: ''
    });
  };

  return (
    <div className="min-h-screen  p-2">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:mb-4">Applications</h1>
          
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by Application or Student Id, Name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
className="pl-8 md:pl-10 py-2 w-full border border-gray-300 focus:border-black focus:ring-black placeholder-gray-500 placeholder:text-sm"

/>
            </div>
            
            <div className="flex items-center gap-3">
              <FiltersDrawer
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
              />
              <AddApplicationModal onAddApplication={handleAddApplication} />
            </div>
          </div>
        </div>

        <ApplicationsTable
          applications={filteredApplications}
          onEdit={handleEdit}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}