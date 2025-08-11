import React, { useState, useEffect } from 'react';
import { LecturerModule, Rating, ModuleReport, CRITERIA_LABELS } from '@/types';
import { getModules, getRatings } from '@/utils/storage-helpers';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Star } from 'lucide-react';

interface ReportsProps {
  onBack: () => void;
}

const Reports: React.FC<ReportsProps> = ({ onBack }) => {
  const [reports, setReports] = useState<ModuleReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ModuleReport | null>(null);

  useEffect(() => {
    const modules = getModules();
    const ratings = getRatings();

    const moduleReports: ModuleReport[] = modules.map(module => {
      const moduleRatings = ratings.filter(r => r.lecturer_module_id === module.id);
      
      if (moduleRatings.length === 0) {
        return {
          module,
          ratings: [],
          averages: {
            criteria_1: 0,
            criteria_2: 0,
            criteria_3: 0,
            criteria_4: 0,
            criteria_5: 0,
            overall: 0
          },
          totalRatings: 0
        };
      }

      const averages = {
        criteria_1: moduleRatings.reduce((sum, r) => sum + r.criteria_1_score, 0) / moduleRatings.length,
        criteria_2: moduleRatings.reduce((sum, r) => sum + r.criteria_2_score, 0) / moduleRatings.length,
        criteria_3: moduleRatings.reduce((sum, r) => sum + r.criteria_3_score, 0) / moduleRatings.length,
        criteria_4: moduleRatings.reduce((sum, r) => sum + r.criteria_4_score, 0) / moduleRatings.length,
        criteria_5: moduleRatings.reduce((sum, r) => sum + r.criteria_5_score, 0) / moduleRatings.length,
        overall: 0
      };

      averages.overall = (averages.criteria_1 + averages.criteria_2 + averages.criteria_3 + averages.criteria_4 + averages.criteria_5) / 5;

      return {
        module,
        ratings: moduleRatings,
        averages,
        totalRatings: moduleRatings.length
      };
    });

    setReports(moduleReports);
  }, []);

  const exportReport = (report: ModuleReport) => {
    const csvContent = [
      ['Module', 'Lecturer', 'Total Ratings', ...CRITERIA_LABELS, 'Overall Average'],
      [
        report.module.module_name,
        report.module.lecturer_name,
        report.totalRatings.toString(),
        ...Object.values(report.averages).slice(0, 5).map(avg => avg.toFixed(2)),
        report.averages.overall.toFixed(2)
      ],
      [],
      ['Individual Ratings:'],
      ['Date', ...CRITERIA_LABELS, 'Remarks'],
      ...report.ratings.map(rating => [
        new Date(rating.created_at).toLocaleDateString(),
        rating.criteria_1_score,
        rating.criteria_2_score,
        rating.criteria_3_score,
        rating.criteria_4_score,
        rating.criteria_5_score,
        rating.remarks || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.module.module_name}_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (selectedReport) {
    return (
      <Layout title="Module Report">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedReport(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
            <Button onClick={() => exportReport(selectedReport)}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{selectedReport.module.module_name}</CardTitle>
              <p className="text-gray-600">Lecturer: {selectedReport.module.lecturer_name}</p>
              <Badge variant="outline">{selectedReport.totalRatings} ratings</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Average Ratings by Criteria</h3>
                <div className="space-y-3">
                  {CRITERIA_LABELS.map((label, index) => (
                    <div key={index}>
                      <p className="text-sm font-medium mb-1">{index + 1}. {label}</p>
                      {renderStars(Object.values(selectedReport.averages)[index])}
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <p className="font-medium mb-1">Overall Average</p>
                    {renderStars(selectedReport.averages.overall)}
                  </div>
                </div>
              </div>

              {selectedReport.ratings.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-4">Student Remarks</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {selectedReport.ratings
                      .filter(rating => rating.remarks)
                      .map((rating, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm">{rating.remarks}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(rating.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Reports Dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Module Reports</h2>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.module.id} className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedReport(report)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{report.module.module_name}</CardTitle>
                    <p className="text-gray-600">Lecturer: {report.module.lecturer_name}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={report.totalRatings > 0 ? "default" : "secondary"}>
                      {report.totalRatings} ratings
                    </Badge>
                    {report.totalRatings > 0 && (
                      <div className="mt-2">
                        {renderStars(report.averages.overall)}
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {reports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No modules found.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reports;