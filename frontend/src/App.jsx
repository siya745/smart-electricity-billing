// App.jsx — Root component with routing setup
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Consumers from './pages/Consumers';
import ConsumerDetails from './pages/ConsumerDetails';
import Billing from './pages/Billing';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All pages are wrapped in Layout (sidebar + header) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="consumers" element={<Consumers />} />
          <Route path="consumers/:id" element={<ConsumerDetails />} />
          <Route path="billing" element={<Billing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
