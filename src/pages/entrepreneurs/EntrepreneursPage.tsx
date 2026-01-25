import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { getEnterprenuerFromDb } from '../../data/users';
import { Entrepreneur } from '../../types';
import axios from 'axios';

export const EntrepreneursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFundingRange, setSelectedFundingRange] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const { user } = useAuth();
  // Get unique industries and funding ranges
  const [entrepreneurs, setEnterprenuers] = useState<Entrepreneur[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const entrepreneurs = await getEnterprenuerFromDb();
        setEnterprenuers(entrepreneurs);
      }
    }
    fetchData();
  }, [user]);

  // Industries from backend (DB)
  const [industries, setIndustries] = useState<string[]>([]);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/industry/get-all`);
        const names = Array.isArray(res.data) ? res.data.map((i: any) => i.name) : [];
        setIndustries(Array.from(new Set(names)).sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error('Failed to fetch industries', error);
      }
    };
    fetchIndustries();
  }, []);
  // Filter out undefined/null locations and get unique ones
  const allLocations = Array.from(new Set(entrepreneurs.map(e => e.location).filter(Boolean)));

  const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];

  // Filter entrepreneurs based on search and filters
  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const indList = Array.isArray(entrepreneur.industry)
      ? (entrepreneur.industry as string[])
      : (typeof entrepreneur.industry === 'string' && entrepreneur.industry)
        ? [entrepreneur.industry as string]
        : [];

    const matchesSearch = searchQuery === '' ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (entrepreneur.startupName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      indList.some(ind => ind.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entrepreneur.pitchSummary || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry = selectedIndustries.length === 0 ||
      indList.some(ind => selectedIndustries.includes(ind));

    const matchesLocation = selectedLocations.length === 0 ||
      selectedLocations.includes(entrepreneur.location);

    // Simple funding range filter based on the amount string
    const matchesFunding = selectedFundingRange.length === 0 ||
      selectedFundingRange.some(range => {
        const amount = entrepreneur.fundingNeeded || 0; // It's already a number
        switch (range) {
          case '< $500K': return amount < 500000;
          case '$500K - $1M': return amount >= 500000 && amount <= 1000000;
          case '$1M - $5M': return amount > 1000000 && amount <= 5000000;
          case '> $5M': return amount > 5000000;
          default: return true;
        }
      });

    const isApproved = entrepreneur.approvalStatus === 'approved';

    return matchesSearch && matchesIndustry && matchesFunding && matchesLocation && isApproved;
  });

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleFundingRange = (range: string) => {
    setSelectedFundingRange(prev =>
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const toggleLocation = (location: string) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Find Startups</h1>
        <p className="text-gray-600">Discover promising startups looking for investment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Industry</h3>
                <div className="space-y-2">
                  {industries.map(industry => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm ${selectedIndustries.includes(industry)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {industry}
                    </button>
                  ))}
                  {industries.length === 0 && <p className="text-xs text-gray-500">No industries found.</p>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Funding Range</h3>
                <div className="space-y-2">
                  {fundingRanges.map(range => (
                    <button
                      key={range}
                      onClick={() => toggleFundingRange(range)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm ${selectedFundingRange.includes(range)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Location</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {allLocations.length > 0 ? (
                    allLocations.map(location => (
                      <button
                        key={location}
                        onClick={() => toggleLocation(location)}
                        className={`flex items-center w-full text-left px-3 py-2 rounded-md text-sm ${selectedLocations.includes(location)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <MapPin size={16} className="mr-2 flex-shrink-0" />
                        <span className="truncate">{location}</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 px-3">No locations found.</p>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search startups by name, industry, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={<Search size={18} />}
              fullWidth
            />

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredEntrepreneurs.length} results
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntrepreneurs.map(entrepreneur => (
              <EntrepreneurCard
                key={entrepreneur.userId}
                entrepreneur={entrepreneur}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};