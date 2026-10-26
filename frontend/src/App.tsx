import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { RoleProvider } from '@/context/RoleContext'
import { DataProvider } from '@/data/DataProvider'
import { AppShell } from '@/components/layout/AppShell'
import { ToastProvider } from '@/components/ui/Toast'
import { CaseDetail } from '@/pages/CaseDetail'
import { Cases } from '@/pages/Cases'
import { Dashboard } from '@/pages/Dashboard'
import { InstitutionDetail } from '@/pages/InstitutionDetail'
import { Institutions } from '@/pages/Institutions'
import { NotFound } from '@/pages/NotFound'
import { Overlaps } from '@/pages/Overlaps'
import { Reports } from '@/pages/Reports'
import { Settings } from '@/pages/Settings'
import { Triage } from '@/pages/Triage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

export default function App() {
  return (
    <ToastProvider>
      <RoleProvider>
        <DataProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<Dashboard />} />
                <Route path="institutions" element={<Institutions />} />
                <Route path="institutions/:id" element={<InstitutionDetail />} />
                <Route path="cases" element={<Cases />} />
                <Route path="cases/:id" element={<CaseDetail />} />
                <Route path="overlaps" element={<Overlaps />} />
                <Route path="triage" element={<Triage />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </RoleProvider>
    </ToastProvider>
  )
}
