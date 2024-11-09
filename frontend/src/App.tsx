import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import './App.css'

export default function Layout({children}: {children: React.ReactNode}){
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}