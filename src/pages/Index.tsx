import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { initializeStorage } from '@/utils/storage';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from './AdminDashboard';
import StudentPortal from './StudentPortal';
import Reports from './Reports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart3, GraduationCap } from 'lucide-react';

type View = 'home' | 'admin' | 'student' | 'reports';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');

  useEffect(() => {
    initializeStorage();
  }, []);

  if (!isAuthenticated && currentView === 'admin') {
    return <LoginForm onBack={() => setCurrentView("home")} />;
  }

  if (currentView === 'admin' && isAuthenticated) {
    return <AdminDashboard onViewReports={() => setCurrentView('reports')} />;
  }

  if (currentView === 'student') {
    return <StudentPortal onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'reports' && isAuthenticated) {
    return <Reports onBack={() => setCurrentView('admin')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <BarChart3 className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            NWC Lecturer Assessment System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive platform for participants to provide anonymous feedback on their guest lecturers 
            and for administrators to track and improve educational quality.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105"
                onClick={() => setCurrentView('student')}>
            <CardHeader className="text-center">
              <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Rating Portal</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Rate your guest lecturers anonymously and help improve the quality of education.
              </p>
              <Button className="w-full" size="lg">
                Access Rating Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105"
                onClick={() => setCurrentView('admin')}>
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-6">
                Manage lecturers, view reports, and analyze feedback data.
              </p>
              <Button className="w-full" variant="outline" size="lg">
                Admin Login
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                <GraduationCap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Anonymous Feedback</h3>
              <p className="text-sm text-gray-600">Participants can provide honest feedback without revealing their identity.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Detailed Analytics</h3>
              <p className="text-sm text-gray-600">Comprehensive reports with averages and individual feedback.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Easy Management</h3>
              <p className="text-sm text-gray-600">Simple interface for managing lecturers and viewing results.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;