import React, { useState, useEffect } from 'react';
import { LecturerModule, Rating } from '@/types';
import { getModules, getRatings, saveRatings, hasRatedModule, addRatedModule } from '@/utils/storage-helpers';
import Layout from '@/components/Layout';
import RatingForm from '@/components/RatingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Home, ArrowLeft } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface StudentPortalProps {
  onBack?: () => void;
}
const StudentPortal: React.FC<StudentPortalProps> = ({ onBack }) => {
  const [modules, setModules] = useState<LecturerModule[]>([]);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LecturerModule | null>(null);

  useEffect(() => {
    const allModules = getModules();
    const activeModules = allModules.filter(m => m.is_active);
    setModules(activeModules);
  }, []);

  const handleRateModule = (module: LecturerModule) => {
    if (hasRatedModule(module.id)) {
      alert('You have already rated this module from this device.');
      return;
    }
    setSelectedModule(module);
    setShowRatingForm(true);
  };

  const handleSubmitRating = (ratingData: {
    criteria_1_score: number;
    criteria_2_score: number;
    criteria_3_score: number;
    criteria_4_score: number;
    criteria_5_score: number;
    remarks?: string;
  }) => {
    if (!selectedModule) return;

    const newRating: Rating = {
      id: uuidv4(),
      lecturer_module_id: selectedModule.id,
      ...ratingData,
      created_at: new Date().toISOString()
    };

    const ratings = getRatings();
    ratings.push(newRating);
    saveRatings(ratings);
    addRatedModule(selectedModule.id);

    setShowRatingForm(false);
    setSelectedModule(null);
    
    alert('Thank you for your feedback! Your rating has been submitted.');
  };

  if (showRatingForm && selectedModule) {
    return (
      <Layout title="Student Portal">
        <RatingForm
          module={selectedModule}
          onSubmit={handleSubmitRating}
          onCancel={() => {
            setShowRatingForm(false);
            setSelectedModule(null);
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Student Portal">
      <div className="space-y-6">
        {/* Back to Home Button */}
        {onBack && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
          >
            <Home className="h-4 w-4" />
            <span>Back to Home</span>
          </Button>
        )}

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Rate Your Lecturers</h2>
          <p className="text-gray-600">Help improve the quality of education by providing anonymous feedback</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const alreadyRated = hasRatedModule(module.id);
            
            return (
              <Card key={module.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{module.module_name}</CardTitle>
                    {alreadyRated && (
                      <Badge variant="secondary" className="flex items-center space-x-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Rated</span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-600">Lecturer: {module.lecturer_name}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4 text-sm">{module.module_description}</p>
                  
                  {module.module_objectives && (
                    <div className="mb-4">
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Objectives:</h4>
                      <p className="text-xs text-gray-600">{module.module_objectives}</p>
                    </div>
                  )}

                  <Button
                    onClick={() => handleRateModule(module)}
                    disabled={alreadyRated}
                    className="w-full"
                    variant={alreadyRated ? "secondary" : "default"}
                  >
                    {alreadyRated ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Already Rated
                      </>
                    ) : (
                      <>
                        <Star className="h-4 w-4 mr-2" />
                        Rate This Module
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No active modules available for rating at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentPortal;