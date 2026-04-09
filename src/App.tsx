/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { MindXDemoProvider } from "./data/mindxDemoContext";
import { LanguageProvider } from "./i18n/LanguageContext";
import AIChatFloat from "./components/AIChatFloat/AIChatFloat";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import DocumentEditor from "./pages/DocumentEditor";
import SharedDocumentView from "./pages/SharedDocumentView";
import SkillsPage from "./pages/SkillsPage";
import V2Layout from "./pages/v2/V2Layout";
import V2ActivityPage from "./pages/v2/V2ActivityPage";
import V2MemoryHomePage from "./pages/v2/V2MemoryHomePage";
import V2MemoryPage from "./pages/v2/V2MemoryPage";
import V2KnowledgePage from "./pages/v2/V2KnowledgePage";
import V2ConnectPage from "./pages/v2/V2ConnectPage";
import V2InboxPage from "./pages/v2/V2InboxPage";
import V2DocumentDetailPage from "./pages/v2/V2DocumentDetailPage";

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
              <Route index element={<Navigate to="/v2/activity" replace />} />
              <Route path="activity" element={<V2ActivityPage />} />
              <Route path="doc/:docId" element={<V2DocumentDetailPage />} />
              <Route path="inbox" element={<V2InboxPage />} />
              <Route path="knowledge" element={<V2KnowledgePage />} />
              <Route path="memory" element={<V2MemoryHomePage />} />
              <Route path="memory/timeline" element={<V2MemoryPage />} />
              {/* Legacy route redirects */}
              <Route
                path="workspace"
                element={<Navigate to="/v2/activity" replace />}
              />
              <Route
                path="workspace/activity"
                element={<Navigate to="/v2/activity" replace />}
              />
              <Route path="workspace/doc" element={<V2DocumentDetailPage />} />
              <Route
                path="memory/sources"
                element={<Navigate to="/v2/inbox" replace />}
              />
              <Route
                path="memory/knowledge"
                element={<Navigate to="/v2/knowledge" replace />}
              />
              <Route path="connect" element={<V2ConnectPage />} />
              <Route
                path="agent"
                element={<Navigate to="/v2/connect" replace />}
              />
            </Route>
          </Routes>
          <AIChatFloat />
        </Router>
      </MindXDemoProvider>
    </LanguageProvider>
  );
}
