/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MindXDemoProvider } from './data/mindxDemoContext';
import { LanguageProvider } from './i18n/LanguageContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import DocumentEditor from './pages/DocumentEditor';
import SharedDocumentView from './pages/SharedDocumentView';
import SkillsPage from './pages/SkillsPage';
import V2Layout from './pages/v2/V2Layout';
import V2WorkspacePage from './pages/v2/V2WorkspacePage';
import V2ActivityPage from './pages/v2/V2ActivityPage';
import V2MemoryHomePage from './pages/v2/V2MemoryHomePage';
import V2MemoryPage from './pages/v2/V2MemoryPage';
import V2DataSourcesPage from './pages/v2/V2DataSourcesPage';
import V2KnowledgePage from './pages/v2/V2KnowledgePage';
import V2ConnectPage from './pages/v2/V2ConnectPage';

export default function App() {
  return (
    <LanguageProvider>
      <MindXDemoProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/skills" element={<SkillsPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/document" element={<DocumentEditor />} />
            <Route path="/shared" element={<SharedDocumentView />} />
            <Route path="/v2" element={<V2Layout />}>
              <Route index element={<Navigate to="/v2/workspace" replace />} />
              <Route path="workspace" element={<V2WorkspacePage />} />
              <Route path="workspace/activity" element={<V2ActivityPage />} />
              <Route path="memory" element={<V2MemoryHomePage />} />
              <Route path="memory/timeline" element={<V2MemoryPage />} />
              <Route path="memory/sources" element={<V2DataSourcesPage />} />
              <Route path="memory/knowledge" element={<V2KnowledgePage />} />
              <Route path="connect" element={<V2ConnectPage />} />
              <Route path="agent" element={<Navigate to="/v2/connect" replace />} />
            </Route>
          </Routes>
        </Router>
      </MindXDemoProvider>
    </LanguageProvider>
  );
}
