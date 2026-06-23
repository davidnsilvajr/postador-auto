import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export function App() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-[280px]">
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
