"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { FileIcon, GitPullRequestIcon, CircleIcon, CircleDotIcon } from "lucide-react"
import { Contributor } from '@/app/(protected)/dashboard/types'

interface RepoDetailsProps {
  repoDetails: {
    fileStructure: Array<{ path: string; type: string }>
    issues: {
      active: Array<{
        number: number
        title: string
        url: string
        author: {
          login: string
          avatar_url: string
          profile_url: string
        }
      }>
      goodFirstIssues: Array<{
        number: number
        title: string
        url: string
        author: Contributor
      }>
      helpWantedIssues: Array<{
        number: number
        title: string
        url: string
        author: Contributor
      }>
    }
    pullRequests: Array<{
      number: number
      title: string
      url: string
      state: string
      description: string
      author: Contributor
    }>
    topContributors: Contributor[]
  }
}

export function RepoDetails({ repoDetails }: RepoDetailsProps) {
  
  const totalContributions = repoDetails.topContributors.reduce(
    (sum, contributor) => sum + contributor.contributions,
    0,
  )

  return (
    <div className="grid gap-5 md:grid-cols-3 lg:grid-cols-4">

      {/* <Card className="col-span-full md:col-span-1 lg:col-span-2 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileIcon className="w-5 h-5" />
            File Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <ul className="space-y-2">
              {repoDetails.fileStructure.map((file, index) => (
                <li key={index} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
                  <Badge variant={file.type === "blob" ? "default" : "secondary"} className="w-16 justify-center">
                    {file.type}
                  </Badge>
                  <span className="text-sm font-medium">{file.path}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card> */}

      <Card className="col-span-full md:col-span-2 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-md font-semibold">
            <CircleDotIcon className="w-5 h-5" />
            Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="good-first">Good First</TabsTrigger>
              <TabsTrigger value="help-wanted">Help Wanted</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <ScrollArea className="w-full h-[400px] overflow-auto">
                <ul className="space-y-6">
                  {repoDetails.issues.active.map((issue) => {
                    console.log('Rendering issue:', {
                      number: issue.number,
                      authorData: issue.author,
                      avatarUrl: issue.author?.avatar_url
                    });

                    return (
                      <li
                        key={issue.number}
                        className="border rounded-lg p-4 shadow-sm bg-background hover:bg-muted transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="w-10 h-10 border border-primary/30 shadow-sm">
                            <AvatarImage
                              src={issue.author.avatar_url}
                              alt={issue.author.login}
                              onError={(e) => {
                                console.error('Avatar load error:', {
                                  url: issue.author.avatar_url,
                                  error: e
                                });
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                            <AvatarFallback>
                              {issue.author.login ? issue.author.login.slice(0, 2).toUpperCase() : 'NA'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <a
                              href={issue.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-base font-medium hover:underline flex items-center gap-2"
                            >
                              #{issue.number}: {issue.title}
                            </a>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <span>by {issue.author.login}</span>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="good-first">
              <ScrollArea className="w-full h-[400px] overflow-auto">
                <ul className="space-y-6">
                  {repoDetails.issues.goodFirstIssues.map((issue) => (
                    <li
                      key={issue.number}
                      className="border rounded-lg p-4 shadow-sm bg-background hover:bg-muted transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="w-10 h-10 border border-primary/30 shadow-sm">
                          <AvatarImage src={issue.author.avatar_url} alt={issue.author.login} />
                          <AvatarFallback>{issue.author.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        {/* Issue Details */}
                        <div className="flex-1">
                          <a
                            href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium hover:underline flex items-center gap-2"
                          >
                            #{issue.number}: {issue.title}
                          </a>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>by {issue.author.login}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="help-wanted">
              <ScrollArea className="w-full h-[400px] overflow-auto">
                <ul className="space-y-6">
                  {repoDetails.issues.helpWantedIssues.map((issue) => (
                    <li
                      key={issue.number}
                      className="border rounded-lg p-4 shadow-sm bg-background hover:bg-muted transition-all duration-200"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <Avatar className="w-10 h-10 border border-primary/30 shadow-sm">
                          <AvatarImage src={issue.author.avatar_url} alt={issue.author.login} />
                          <AvatarFallback>{issue.author.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>

                        {/* Issue Details */}
                        <div className="flex-1">
                          <a
                            href={issue.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base font-medium hover:underline flex items-center gap-2"
                          >
                            #{issue.number}: {issue.title}
                          </a>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <span>by {issue.author.login}</span>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>



      <Card className="col-span-full md:col-span-2 shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-md font-semibold">
            <GitPullRequestIcon className="w-5 h-5" />
            Pull Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="w-full max-w-4xl h-[400px] px-4">
            <ul className="space-y-6">
              {repoDetails.pullRequests.map((pr) => (
                <li
                  key={pr.number}
                  className="border rounded-lg py-3 pl-3 shadow-sm bg-background hover:bg-muted transition-all duration-200 "
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar at Top Left */}
                    <Avatar className="w-8 h-8 border border-primary/30 shadow-sm">
                      <AvatarImage src={pr.author.avatar_url} alt={pr.author.login} />
                      <AvatarFallback>{pr.author.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    {/* PR Details */}
                    <div className="flex-1">
                      <a
                        href={pr.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base font-medium hover:underline flex items-center gap-2"
                      >
                        #{pr.number}: {pr.title}
                      </a>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <Badge variant={pr.state === "open" ? "default" : "secondary"}>
                          {pr.state}
                        </Badge>
                        <span>by {pr.author.login}</span>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground line-clamp-2">{pr.description}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>






      <Card className="col-span-full shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CircleIcon className="w-5 h-5" />
            Top Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {repoDetails.topContributors.map((contributor) => (
              <div key={contributor.login} className="flex items-center space-x-4 p-4 bg-muted/10 rounded-lg">
                <Avatar className="border-2 border-primary/10">
                  <AvatarImage src={contributor.avatar_url} alt={contributor.login} />
                  <AvatarFallback>{contributor.login.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <a
                      href={contributor.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:underline"
                    >
                      {contributor.login}
                    </a>
                    <Badge variant="outline">{contributor.contributions}</Badge>
                  </div>
                  <Progress
                    value={(contributor.contributions / totalContributions) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div >
  )
}

function IssueList({
  issues,
}: {
  issues: Array<{
    number: number
    title: string
    url: string
    author: { login: string; avatar_url: string }
  }>
}) {
  return (
    <ScrollArea className="h-[300px]">
      <ul className="space-y-2">
        {issues.map((issue) => (
          <li key={issue.number} className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md transition-colors">
            <Avatar className="w-6 h-6 border border-primary/10">
              <AvatarImage src={issue.author.avatar_url} alt={issue.author.login} />
              <AvatarFallback>{issue.author.login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <a
              href={issue.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline flex-1 line-clamp-1"
            >
              #{issue.number}: {issue.title}
            </a>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}