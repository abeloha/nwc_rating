import React, { useState, useEffect } from 'react';
import { LecturerModule } from '@/types';
import { getModules, saveModules } from '@/utils/storage-helpers';
import Layout from '@/components/Layout';
import ModuleForm from '@/components/ModuleForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BarChart3, Eye } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface AdminDashboardProps {
  onViewReports: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewReports }) => {
  const [modules, setModules] = useState<LecturerModule[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingModule, setEditingModule] = useState<LecturerModule | undefined>();

  useEffect(() => {
    setModules(getModules());
  }, []);

  const handleSubmit = (moduleData: Omit<LecturerModule, 'id' | 'created_at'>) => {
    if (editingModule) {
      const updatedModules = modules.map(m =>
        m.id === editingModule.id
          ? { ...editingModule, ...moduleData }
          : m
      );
      setModules(updatedModules);
      saveModules(updatedModules);
    } else {
      const newModule: LecturerModule = {
        ...moduleData,
        id: uuidv4(),
        created_at: new Date().toISOString()
      };
      const updatedModules = [...modules, newModule];
      setModules(updatedModules);
      saveModules(updatedModules);
    }
    
    setShowForm(false);
    setEditingModule(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this module?')) {
      const updatedModules = modules.filter(m => m.id !== id);
      setModules(updatedModules);
      saveModules(updatedModules);
    }
  };

  const toggleActive = (id: string) => {
    const updatedModules = modules.map(m =>
      m.id === id ? { ...m, is_active: !m.is_active } : m
    );
    setModules(updatedModules);
    saveModules(updatedModules);
  };

  if (showForm) {
    return (
      <Layout title="Admin Dashboard">
        <ModuleForm
          module={editingModule}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingModule(undefined);
          }}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Lecturer Modules</h2>
          <div className="flex space-x-2">
            <Button onClick={onViewReports} variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              View Reports
            </Button>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Module
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{module.module_name}</CardTitle>
                    <p className="text-gray-600">Lecturer: {module.lecturer_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={module.is_active ? "default" : "secondary"}>
                      {module.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{module.module_description}</p>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingModule(module);
                      setShowForm(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={module.is_active ? "secondary" : "default"}
                    onClick={() => toggleActive(module.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    {module.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(module.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No modules found. Add your first module to get started.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;