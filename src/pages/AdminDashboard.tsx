import React, { useState, useEffect } from 'react';
import { LecturerModule } from '@/types';
import { getModules, saveModule } from '@/utils/storage-helpers';
import Layout from '@/components/Layout';
import ModuleForm from '@/components/ModuleForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BarChart3, Eye, X } from 'lucide-react';

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

  useEffect(() => {
    const loadModules = async () => {
      setIsLoading(true);
      try {
        const data = await getModules();
        setModules(data);
      } catch (err) {
        setError('Failed to load modules');
        console.error('Error loading modules:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadModules();
  }, []);

  const handleSubmit = async (moduleData: Omit<LecturerModule, 'id' | 'created_at'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      let updatedModule: LecturerModule;
      
      if (editingModule) {
        // For updates, we'll need to implement an update endpoint
        // For now, we'll treat it as a new module
        updatedModule = await saveModule(moduleData);
        setModules(modules.map(m => m.id === editingModule.id ? updatedModule : m));
      } else {
        // Create new module
        setNewModule({...moduleData, id: "", created_at: ""});      
        updatedModule = await saveModule(moduleData);
        setModules([...modules, updatedModule]);
      }
      
      // Only clear the form if the save was successful
      setShowForm(false);
      setEditingModule(undefined);
      setNewModule(undefined);      
    } catch (err) {
      setError('Failed to save module. Please try again.');
      console.error('Error saving module:', err);
      // Don't clear the form or editing state on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    // In a real app, you would call a delete API endpoint here
    // For now, we'll just update the local state
    setModules(modules.filter(m => m.id !== id));
  };

  const handleEdit = (module: LecturerModule) => {
    setEditingModule(module);
    setShowForm(true);
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
          {modules.map((module) => (
            <Card key={module.id} className="relative">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{module.module_name}</CardTitle>
                  <Badge variant={module.is_active ? 'default' : 'secondary'}>
                    {module.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{module.lecturer_name}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{module.module_description}</p>
                <div className="flex justify-end space-x-2">
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
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;