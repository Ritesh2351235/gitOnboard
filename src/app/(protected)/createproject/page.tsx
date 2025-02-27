"use client"

import { useRouter } from "next/navigation"
import CreateProjectComponent from "@/components/CreateProjectComponent"

// This is the page component - it doesn't need the props that your original component used
export default function CreateProjectPage() {
  const router = useRouter()

  // This function will be passed to your CreateProjectComponent
  const handleProjectCreated = () => {
    // Any additional logic you want to run after project creation
  }

  return (
    <CreateProjectComponent onProjectCreated={handleProjectCreated} />
  )
}