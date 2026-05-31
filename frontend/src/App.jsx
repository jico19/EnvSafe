import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './page/login';
import Register from './page/register';
import Dashboard from './page/dashboard';
import Organizations from './page/organizations';
import OrganizationForm from './page/OrganizationForm';
import Projects from './page/projects';
import ProjectForm from './page/ProjectForm';
import ProjectVariables from './page/ProjectVariables';
import ProjectMembers from './page/ProjectMembers';
import TeamManagement from './page/TeamManagement';
import VariableForm from './page/VariableForm';
import AuditLogs from './page/auditlogs';
import Plan from './page/Plan';
import Layout from './components/Layout';
import Landing from './page/Landing';
import Docs from './page/Docs';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/docs" element={<Docs />} />
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/organizations" element={<ProtectedRoute><Organizations /></ProtectedRoute>} />
          <Route path="/organizations/new" element={<ProtectedRoute><OrganizationForm /></ProtectedRoute>} />
          <Route path="/organizations/edit/:id" element={<ProtectedRoute><OrganizationForm /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/projects/new" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
          <Route path="/projects/edit/:id" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
          <Route path="/projects/:id/members" element={<ProtectedRoute><ProjectMembers /></ProtectedRoute>} />
          <Route path="/projects/:id/variables" element={<ProtectedRoute><ProjectVariables /></ProtectedRoute>} />
          <Route path="/projects/:id/variables/new" element={<ProtectedRoute><VariableForm /></ProtectedRoute>} />
          <Route path="/projects/:id/variables/edit/:varId" element={<ProtectedRoute><VariableForm /></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
          <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
