import React, { useState } from 'react';
import { LecturerModule, CRITERIA_LABELS } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, ArrowLeft } from 'lucide-react';

interface RatingFormProps {
  module: LecturerModule;
  onSubmit: (rating: {
    criteria_1_score: number;
    criteria_2_score: number;
    criteria_3_score: number;
    criteria_4_score: number;
    criteria_5_score: number;
    remarks?: string;
  }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const RatingForm: React.FC<RatingFormProps> = ({ module, onSubmit, isSubmitting, onCancel }) => {
  const [scores, setScores] = useState<number[]>([0, 0, 0, 0, 0]);
  const [remarks, setRemarks] = useState('');

  const handleScoreChange = (criteriaIndex: number, score: number) => {
    const newScores = [...scores];
    newScores[criteriaIndex] = score;
    setScores(newScores);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (scores.some(score => score === 0)) {
      alert('Please rate all criteria');
      return;
    }

    onSubmit({
      criteria_1_score: scores[0],
      criteria_2_score: scores[1],
      criteria_3_score: scores[2],
      criteria_4_score: scores[3],
      criteria_5_score: scores[4],
      remarks: remarks.trim() || undefined
    });
  };

  const renderStarRating = (criteriaIndex: number) => (
    <RadioGroup
      value={scores[criteriaIndex].toString()}
      onValueChange={(value) => handleScoreChange(criteriaIndex, parseInt(value))}
      className="flex space-x-2"
    >
      {[1, 2, 3, 4, 5].map((rating) => (
        <div key={rating} className="flex items-center space-x-1">
          <RadioGroupItem
            value={rating.toString()}
            id={`criteria-${criteriaIndex}-${rating}`}
            className="sr-only"
          />
          <Label
            htmlFor={`criteria-${criteriaIndex}-${rating}`}
            className="cursor-pointer"
          >
            <Star
              className={`h-6 w-6 ${
                scores[criteriaIndex] >= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button
        type="button"
        variant="ghost"
        onClick={onCancel}
        className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Rate Your Lectures</span>
      </Button>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Rate: {module.module_name}</CardTitle>
          <p className="text-sm text-gray-600">Lecturer: {module.lecturer_name}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {CRITERIA_LABELS.map((label, index) => (
              <div key={index} className="space-y-3">
                <Label className="text-base font-medium">
                  {index + 1}. {label}
                </Label>
                {renderStarRating(index)}
              </div>
            ))}

            <div className="space-y-2">
              <Label htmlFor="remarks">Additional Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                maxLength={500}
                placeholder="Share your thoughts about the lecturer and module..."
              />
              <p className="text-sm text-gray-500">{remarks.length}/500 characters</p>
            </div>

            <div className="flex space-x-2">
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
                Submit Rating

              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lectures
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RatingForm;