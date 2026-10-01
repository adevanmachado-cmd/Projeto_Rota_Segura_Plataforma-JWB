import { Route, Routes } from 'react-router-dom';
import AppShell from '@/components/AppShell';
import Home from '@/pages/Home';
import Schools from '@/pages/Schools';
import Learn from '@/pages/Learn';
import Campaigns from '@/pages/Campaigns';
import Reports from '@/pages/Reports';
import Indicators from '@/pages/Indicators';
import Login from '@/pages/Login';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Home />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/indicators" element={<Indicators />} />
      </Route>
    </Routes>
  );
}

