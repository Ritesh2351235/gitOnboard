"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { GithubIcon, X, Loader2 } from "lucide-react"
import useRefreshProjects from "@/hooks/useRefreshProjects"

interface CreateProjectProps {
  onProjectCreated: () => void
}

const CreateProjectComponent: React.FC<CreateProjectProps> = ({ onProjectCreated }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [githubUrl, setGithubUrl] = useState("")
  const [name, setName] = useState("")
  const [githubToken, setGithubToken] = useState("")
  const refreshProjects = useRefreshProjects();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubUrl, name }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Error creating project:', errorData.error)
        // Handle the error (e.g., show a notification to the user)
        return
      }

      const data = await response.json()
      console.log('Project created:', data)
      onProjectCreated() // Call the callback function
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    router.push('/dashboard'); // Redirect to dashboard on close
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={handleClose} // Use handleClose to redirect
          disabled={isLoading}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create New Project</CardTitle>
          <CardDescription className="text-center">Enter your project details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="My Awesome Project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username/repo"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="githubToken">GitHub Token (Optional)</Label>
              <Input
                id="githubToken"
                type="password"
                placeholder="Enter your GitHub token"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            type="submit"
            onClick={(e) => handleSubmit(e as any)}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <GithubIcon className="w-4 h-4 mr-2" />
                Create Project
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default CreateProjectComponent