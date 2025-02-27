"use client"

import MDEditor from '@uiw/react-md-editor';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import React from 'react'
import { askQuestion, analyzeGitHubRepository } from './actions'
import { readStreamableValue } from 'ai/rsc'
import CodeReferences from './codeReferences';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RepoDetails } from './repodetails';
import { Contributor } from './types';
import { GitBranchIcon, RefreshCwIcon } from 'lucide-react';
import { GlowingStarsBackgroundCard, GlowingStarsDescription, GlowingStarsTitle } from '@/components/ui/glowing-stars';
import { Arrow } from '@radix-ui/react-tooltip';
import useProject from '@/hooks/use-project';
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface RepoDetails {
  fileStructure: Array<{ path: string; type: string }>;
  issues: {
    active: Array<{ number: number; title: string; url: string; author: { login: string; avatar_url: string } }>;
    goodFirstIssues: Array<{ number: number; title: string; url: string; author: { login: string; avatar_url: string } }>;
    helpWantedIssues: Array<{ number: number; title: string; url: string; author: { login: string; avatar_url: string } }>;
  };
  pullRequests: Array<{
    number: number;
    title: string;
    url: string;
    state: string;
    description: string;
    author: { login: string; avatar_url: string };
  }>;
  topContributors: Contributor[];
}

// Update the cardBaseStyles to remove some border styling
const cardBaseStyles = cn(
  "rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6",
  "w-full",
  "flex flex-col gap-1.5",
  "bg-brand-white dark:bg-brand-medium-black",
  "shadow-[0px_51px_20px_rgba(186,186,186,0.01),0px_29px_17px_rgba(186,186,186,0.05),0px_13px_13px_rgba(186,186,186,0.09),0px_3px_7px_rgba(186,186,186,0.1)]",
  "dark:shadow-none"
);

const Dashboard = () => {
  const { user } = useUser()
  const [question, setQuestion] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [fileReferenced, setFileReferenced] = React.useState<{ fileName: string, summary: string, sourceCode: string }[]>([]);
  const [answer, setAnswer] = React.useState('');
  const [repoDetails, setRepoDetails] = useState<RepoDetails>({
    fileStructure: [],
    issues: {
      active: [],
      goodFirstIssues: [],
      helpWantedIssues: [],
    },
    pullRequests: [],
    topContributors: [],
  });
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { projects, projectId, setProjectId, project, fetchProjects } = useProject();
  const { theme } = useTheme();
  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setAnswer('');
    setFileReferenced([]);
    e.preventDefault()
    setLoading(true);

    const { output, fileReferenced } = await askQuestion(question, projectId);
    setOpen(true);
    setFileReferenced(fileReferenced);

    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer(ans => ans + delta);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    const fetchRepoDetails = async () => {
      const githuburl = project?.githubUrl;
      if (!githuburl) {
        console.log('GitHub URL is not defined');
        return;
      }
      const parsedUrl = parseGitHubURL(githuburl);
      if (!parsedUrl) {
        console.error('Failed to parse GitHub URL');
        return;
      }
      const { owner, repo } = parsedUrl;

      try {
        const analysis = await analyzeGitHubRepository(owner!, repo!);
        if (analysis) {
          setRepoDetails(analysis);
          console.log(analysis);
        } else {
          console.error('Failed to analyze repository.');
          setRepoDetails({
            fileStructure: [],
            issues: { active: [], goodFirstIssues: [], helpWantedIssues: [] },
            pullRequests: [],
            topContributors: [],
          });
        }
      } catch (error) {
        console.error('Error analyzing repository:', error);
        setRepoDetails({
          fileStructure: [],
          issues: { active: [], goodFirstIssues: [], helpWantedIssues: [] },
          pullRequests: [],
          topContributors: [],
        });
      }
    };

    fetchRepoDetails();
  }, [project]);

  useEffect(() => {
    if (searchParams?.get("newProject")) {
      router.replace(pathname || "/dashboard", { scroll: false });
      window.location.href = pathname || "/dashboard"; // Full reload
    }
  }, [searchParams, pathname, router]);


  function parseGitHubURL(url: string) {
    const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/);
    if (!match) return null;

    return {
      owner: match[1],
      repo: match[2]
    };
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[70vw] h-[90vh] flex flex-col bg-background">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-foreground">Answer</DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-grow pr-4" data-color-mode={theme}>
            <div className="space-y-6">
              <MDEditor.Markdown
                source={answer}
                className={cn(
                  "prose max-w-none",
                  {
                    "prose-invert": theme === "dark",
                    "prose-slate": theme === "light"
                  }
                )}
                style={{
                  backgroundColor: 'transparent',
                  color: theme === 'dark' ? '#fff' : '#000'
                }}
              />
              <CodeReferences fileReferenced={fileReferenced} />
            </div>
          </ScrollArea>

          <div className="flex justify-end pt-6 border-t border-border">
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex gap-16 justify-center items-end">
        {/* Updated Ask Question Card */}
        <div className={cn(cardBaseStyles, "max-w-[700px]")}>
          <div className="flex h-10 justify-between gap-2">
            <h2 className="pt-0.5 text-xl/[1.375rem] font-semibold -tracking-4 md:text-2xl/[1.875rem] flex items-center gap-2">
              <GitBranchIcon className="h-5 w-5" />
              Ask a Question
            </h2>
          </div>

          <div className={cn(
            "rounded-lg p-4 mt-4",
            "bg-brand-background dark:bg-brand-medium-black"
          )}>
            <form onSubmit={handlesubmit} className="space-y-4">
              <Textarea
                placeholder="Ask a question about your project..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={cn(
                  "min-h-[120px] resize-none",
                  "bg-brand-white dark:bg-brand-medium-black",
                  "focus:bg-brand-white dark:focus:bg-brand-medium-black",
                  "transition-colors"
                )}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "px-8",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90",
                    "disabled:opacity-50"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <RefreshCwIcon className="h-4 w-4 animate-spin" />
                      Getting Answer...
                    </span>
                  ) : (
                    "Get Answer"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <GlowingStarsBackgroundCard className="w-[300px] h-[300px]">
          <GlowingStarsTitle>gitOnboard</GlowingStarsTitle>
          <div className="flex justify-between items-end">
            <GlowingStarsDescription>
              Onboard Faster, Contribute Smarter.
            </GlowingStarsDescription>
          </div>
        </GlowingStarsBackgroundCard>
      </div>


      <div className="space-y-4">
        {Object.keys(repoDetails).length > 0 && (
          <div className={cardBaseStyles}>
            <h2 className="pt-0.5 text-xl/[1.375rem] font-semibold -tracking-4 md:text-2xl/[1.875rem]">
              Repository Details
            </h2>
            <div className={cn(
              "rounded-lg p-4 mt-4",
              "bg-brand-background dark:bg-brand-medium-black"
            )}>
              <RepoDetails repoDetails={{
                fileStructure: repoDetails.fileStructure,
                issues: {
                  active: repoDetails.issues.active.map(issue => ({
                    ...issue,
                    author: {
                      login: 'unknown',
                      avatar_url: '',
                      contributions: 0,
                      profile_url: '',
                    }
                  })),
                  goodFirstIssues: repoDetails.issues.goodFirstIssues.map(issue => ({
                    ...issue,
                    author: {
                      login: 'unknown',
                      avatar_url: '',
                      contributions: 0,
                      profile_url: '',
                    }
                  })),
                  helpWantedIssues: repoDetails.issues.helpWantedIssues.map(issue => ({
                    ...issue,
                    author: {
                      login: 'unknown',
                      avatar_url: '',
                      contributions: 0,
                      profile_url: '',
                    }
                  })),
                },
                pullRequests: repoDetails.pullRequests.map(pr => ({
                  ...pr,
                  author: {
                    login: pr.author.login || 'unknown',
                    avatar_url: pr.author.avatar_url || '',
                    contributions: 0,
                    profile_url: '',
                  },
                })),
                topContributors: repoDetails.topContributors.map(contributor => ({
                  ...contributor,
                  avatar_url: contributor.avatar_url || ''
                })),
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard