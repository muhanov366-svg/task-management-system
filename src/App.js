import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Dashboard from './pages/Dashboard';
import ActiveSprint from './pages/ActiveSprint';
import AdminPanel from './pages/AdminPanel';
import MainLayout from './components/MainLayout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/active-sprint" element={<ActiveSprint />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </MainLayout>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;