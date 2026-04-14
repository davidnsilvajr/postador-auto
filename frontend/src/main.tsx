import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { App } from './App'
import { Dashboard } from '@/pages/Dashboard'
import { PostsPage } from '@/pages/PostsPage'
import { CalendarPage } from '@/pages/CalendarPage'
import { GeneratePage } from '@/pages/GeneratePage'
import { IntegrationsPage } from '@/pages/IntegrationsPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { SettingsPage } from '@/pages/SettingsPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="posts" element={<PostsPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="generate" element={<GeneratePage />} />
          <Route path="integrations" element={<IntegrationsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
