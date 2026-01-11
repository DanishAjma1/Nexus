import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { useApprovalStats } from '../../hooks/useApprovalStatus';

export const ApprovalStatusWidget: React.FC = () => {
  const { stats, loading, error } = useApprovalStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-gray-100 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="mb-6 bg-red-50 border-red-200">
        <div className="p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </Card>
    );
  }

  const statsData = [
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'from-yellow-50 to-yellow-100',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-600',
      iconColor: 'text-yellow-400',
    },
    {
      label: 'Approved',
      value: stats.approved,
      icon: CheckCircle,
      color: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      textColor: 'text-green-600',
      iconColor: 'text-green-400',
    },
    {
      label: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      color: 'from-red-50 to-red-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-600',
      iconColor: 'text-red-400',
    },
    {
      label: 'Total',
      value: stats.total,
      icon: AlertCircle,
      color: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      iconColor: 'text-blue-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} border ${stat.borderColor}`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`${stat.textColor} text-sm font-medium`}>
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                </div>
                <Icon className={`w-12 h-12 ${stat.iconColor} opacity-50`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ApprovalStatusWidget;
