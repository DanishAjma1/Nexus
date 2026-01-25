import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Entrepreneur } from '../../types';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AmountMeasureWithTags } from "../../data/users";
interface EntrepreneurCardProps {
  entrepreneur: Entrepreneur;
  showActions?: boolean;
}

export const EntrepreneurCard: React.FC<EntrepreneurCardProps> = ({
  entrepreneur,
  showActions = true
}) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/profile/entrepreneur/${entrepreneur.userId || entrepreneur._id}`);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/chat/${entrepreneur.userId || entrepreneur._id}`);
  };

  return (
    <Card
      hoverable
      className="transition-all duration-300 h-full"
      onClick={handleViewProfile}
    >
      <CardBody className="flex flex-col">
        <div className="flex items-start">
          <Avatar
            src={entrepreneur.avatarUrl}
            alt={entrepreneur.name}
            size="lg"
            status={entrepreneur.isOnline ? 'online' : 'offline'}
            className="mr-4"
          />

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
              {entrepreneur.name}
              {entrepreneur.isSuspended && (
                <span className="inline-flex items-center font-medium rounded text-xs px-2 py-0.5 bg-red-100 text-red-800">
                  Suspended
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-500 mb-2">{entrepreneur.startupName}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {(() => {
                const inds = Array.isArray(entrepreneur.industry)
                  ? (entrepreneur.industry as string[])
                  : (typeof entrepreneur.industry === 'string' && entrepreneur.industry.trim())
                    ? [entrepreneur.industry as string]
                    : [];
                return inds.length > 0 ? (
                  inds.map((ind, idx) => (
                    <Badge key={idx} variant="primary" size="sm">{ind}</Badge>
                  ))
                ) : (
                  <Badge variant="primary" size="sm">--</Badge>
                );
              })()}
              <Badge variant="gray" size="sm">{entrepreneur.teamSize}</Badge>
              <Badge variant="accent" size="sm">Founded {entrepreneur.foundedYear}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-900 mb-1">Pitch Summary</h4>
          <p className="text-sm text-gray-600 line-clamp-3">{entrepreneur.pitchSummary}</p>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <div>
            <span className="text-xs text-gray-500">Funding Need</span>
            <p className="text-sm font-medium text-gray-900">{AmountMeasureWithTags(entrepreneur.fundingNeeded ?? 0)}</p>
          </div>

          <div>
            <span className="text-xs text-gray-500">Team Size</span>
            <p className="text-sm font-medium text-gray-900">{entrepreneur.teamSize} people</p>
          </div>
        </div>
      </CardBody>

      {showActions && (
        <CardFooter className="border-t border-gray-100 bg-gray-50 flex justify-between">


          <Button
            variant="primary"
            size="sm"
            rightIcon={<ExternalLink size={16} />}
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};