import React, { useState, useEffect } from 'react';
import { LecturerModule } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ModuleFormProps {
  module?: LecturerModule;
  onSubmit: (module: Omit<LecturerModule, 'id' | 'created_at'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const ModuleForm: React.FC<ModuleFormProps> = ({ 
  module, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const [formData, setFormData] = useState<Omit<LecturerModule, 'id' | 'created_at'>>({
    lecturer_name: '',
    module_name: '',
    module_description: '',
    module_objectives: '',
    email: '',
    is_active: true
  });

  // Only update form data when the module prop changes and is different from current form data
  useEffect(() => {
    if (module) {
      setFormData(prevState => ({
        ...prevState,
        lecturer_name: module.lecturer_name,
        module_name: module.module_name,
        module_description: module.module_description,
        module_objectives: module.module_objectives || '',
        email: module.email || '',
        is_active: module.is_active
      }));
    } 
  }, [module]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{module ? "Edit" : "Add"} Lecturer Module</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="module_name">Module Name *</Label>
              <Input
                id="module_name"
                value={formData.module_name}
                onChange={(e) =>
                  setFormData({ ...formData, module_name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lecturer_name">Lecturer Name *</Label>
              <Input
                id="lecturer_name"
                value={formData.lecturer_name}
                onChange={(e) =>
                  setFormData({ ...formData, lecturer_name: e.target.value })
                }
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="module_description">Module Description *</Label>
            <Textarea
              id="module_description"
              value={formData.module_description}
              onChange={(e) =>
                setFormData({ ...formData, module_description: e.target.value })
              }
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module_objectives">Module Objectives</Label>
            <Textarea
              id="module_objectives"
              value={formData.module_objectives}
              onChange={(e) =>
                setFormData({ ...formData, module_objectives: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
              disabled={isSubmitting}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ModuleForm;