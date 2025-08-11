import React, { useState, useEffect } from 'react';
import { LecturerModule, Rating } from '@/types';
import { getModules, getRatings, saveRating, hasRatedModule, addRatedModule } from '@/utils/storage-helpers';
import Layout from '@/components/Layout';
import RatingForm from '@/components/RatingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, CheckCircle, Home, ArrowLeft, Loader2, X } from 'lucide-react';

interface StudentPortalProps {
  onBack?: () => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ onBack }) => {
  const [modules, setModules] = useState<LecturerModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [selectedModule, setSelectedModule] = useState<LecturerModule | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [modulesData, ratingsData] = await Promise.all([
          getModules(),
          getRatings()
        ]);
        setModules(modulesData.filter(m => m.is_active));
        setRatings(ratingsData);
      } catch (err) {
        setError('Failed to load data');
        console.error('Error loading data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRateModule = (module: LecturerModule) => {
    if (hasRatedModule(module.id)) {
      alert('You have already rated this module.');
      return;
    }
    setSelectedModule(module);
    setShowRatingForm(true);
  };

  const handleSubmitRating = async (ratingData: Omit<Rating, 'id' | 'created_at' | 'module_name' | 'lecturer_name'>) => {
    if (!selectedModule) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newRating = {
        ...ratingData,
        lecturer_module_id: selectedModule.id,
        module_name: selectedModule.module_name,
        lecturer_name: selectedModule.lecturer_name,
      };

      const savedRating = await saveRating(newRating);
      
      // Update local state
      setRatings([...ratings, savedRating]);
      addRatedModule(selectedModule.id);
      
      // Close the form
      setShowRatingForm(false);
      setSelectedModule(null);
      
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
      console.error('Error saving rating:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAverageRating = (moduleId: number): number => {
    const moduleRatings = ratings.filter(r => r.lecturer_module_id === moduleId);
    if (moduleRatings.length === 0) return 0;
    
    const total = moduleRatings.reduce((sum, r) => sum + r.criteria_1_score + r.criteria_2_score + r.criteria_3_score + r.criteria_4_score + r.criteria_5_score, 0);
    return Math.round((total / (moduleRatings.length * 5)) * 10) / 10;
  };

  if (isLoading) {
    return (
      <Layout title="Student Portal">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Student Portal">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md relative">
            <div className="flex justify-between items-center">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {showRatingForm && selectedModule ? (
          <div className="container mx-auto px-4 py-8">
            <Button
              variant="ghost"
              onClick={() => {
                setShowRatingForm(false);
                setSelectedModule(null);
              }}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modules
            </Button>
            
            <Card>
              <CardHeader>
                <CardTitle>Rate {selectedModule.module_name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Lecturer: {selectedModule.lecturer_name}
                </p>
              </CardHeader>
              <CardContent>
                <RatingForm
                  module={selectedModule}
                  onSubmit={handleSubmitRating}
                  onCancel={() => {
                    setShowRatingForm(false);
                    setSelectedModule(null);
                  }}
                  isSubmitting={isSubmitting}
                />
                {error && <div className="mt-4 text-red-600">{error}</div>}
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Available Modules</h1>
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module) => {
                const avgRating = getAverageRating(module.id);
                const alreadyRated = hasRatedModule(module.id);
                
                return (
                  <Card key={module.id} className="relative">
                    <CardHeader>
                      <CardTitle className="text-lg">{module.module_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Lecturer: {module.lecturer_name}
                      </p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{module.module_description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm">
                            {avgRating > 0 ? `${avgRating}/5` : 'No ratings yet'}
                          </span>
                        </div>
                        <Button
                          onClick={() => handleRateModule(module)}
                          disabled={alreadyRated}
                          variant={alreadyRated ? 'outline' : 'default'}
                          className={alreadyRated ? 'opacity-100' : ''}
                        >
                          {alreadyRated ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Rated
                            </>
                          ) : (
                            'Rate Module'
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {modules.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No active modules available for rating.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentPortal;