import React, { useState, useEffect } from 'react';
import { LecturerModule, Rating } from '@/types';
import { deleteModule, getModules, getRatings, saveModule, updateModule } from '@/utils/storage-helpers';
import Layout from '@/components/Layout';
import ModuleForm from '@/components/ModuleForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BarChart3, Eye, X, Star } from 'lucide-react';

interface AdminDashboardProps {
  onViewReports: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewReports }) => {
  const [modules, setModules] = useState<LecturerModule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState<LecturerModule | undefined>();
  const [newModule, setNewModule] = useState<LecturerModule | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
    const [ratings, setRatings] = useState<Rating[]>([]);
  

  const loadModules = async () => {
    setIsLoading(true);
    try {
     const [modulesData, ratingsData] = await Promise.all([
               getModules(),
               getRatings()
             ]);
      setModules(modulesData);
      setRatings(ratingsData);
      setError(null);
    } catch (err) {
      setError('Failed to load modules');
      console.error('Error loading modules:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleSubmit = async (moduleData: Omit<LecturerModule, 'id' | 'created_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let updatedModule: LecturerModule;
      
      if (editingModule) {
        // Update existing module
        updatedModule = await updateModule(moduleData, editingModule.id);
      } else {
        // Create new module
        updatedModule = await saveModule(moduleData);
      }
      
      // Reload modules from the server to ensure we have the latest data
      await loadModules();
      
      // Close the form
      setShowForm(false);
      setEditingModule(undefined);
      setNewModule(undefined);
    } catch (err) {
      setError('Failed to save module. Please try again.');
      console.error('Error saving module:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    deleteModule(id);
    loadModules();
  };

  const handleEdit = (module: LecturerModule) => {
    setEditingModule(module);
    setShowForm(true);
  };


    const getAverageRating = (moduleId: number): number => {
      const moduleRatings = ratings.filter(
        (r) => r.lecturer_module_id === moduleId
      );
      if (moduleRatings.length === 0) return 0;

      const total = moduleRatings.reduce(
        (sum, r) =>
          sum +
          r.criteria_1_score +
          r.criteria_2_score +
          r.criteria_3_score +
          r.criteria_4_score +
          r.criteria_5_score,
        0
      );
      return Math.round((total / (moduleRatings.length * 5)) * 10) / 10;
    };
  if (isLoading) {
    return (
      <Layout title="Admin Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading modules...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
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
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="space-x-2">
            <Button variant="outline" onClick={onViewReports}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View Reports
            </Button>
            <Button onClick={() => {
              setEditingModule(undefined);
              setShowForm(true);
            }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Module
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingModule ? 'Edit Module' : 'Add New Module'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ModuleForm
                module={editingModule || newModule}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingModule(undefined);
                  setNewModule(undefined);
                }}
                isSubmitting={isLoading}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const avgRating = getAverageRating(module.id);
            return (
              <Card key={module.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {module.module_name}
                    </CardTitle>
                    <Badge variant={module.is_active ? "default" : "secondary"}>
                      {module.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {module.lecturer_name}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{module.module_description}</p>
                  <div className="flex justify-end space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm">
                        {avgRating > 0 ? `${avgRating}/5` : "No ratings yet"}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(module)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(module.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
        }
          )
          
          
          }
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;