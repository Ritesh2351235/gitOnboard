import { Octokit } from '@octokit/rest';
import { components } from '@octokit/openapi-types';

// Define correct type for tree items
type GitTreeItem = components['schemas']['git-tree'];
export interface TreeEntry {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size?: number;
  url: string;
}

interface RepoAnalysis {
  fileStructure: TreeEntry[];
  issues: {
    active: Issue[];
    goodFirstIssues: Issue[];
    helpWantedIssues: Issue[];
  };
  pullRequests: PullRequest[];
  topContributors: Contributor[];
}

interface Issue {
  number: number;
  title: string;
  url: string;
  labels: string[];
  created_at: string;
  author: {
    login: string;
    avatar_url: string;
    profile_url: string;
  };
  description: string;  // This will be the body of the issue
}

// Update the PullRequest interface
interface PullRequest {
  number: number;
  title: string;
  url: string;
  state: string;
  description: string;  // This will be the body of the PR
  author: {
    login: string;
    avatar_url: string;
    profile_url: string;
  };
}

interface Contributor {
  login: string;
  contributions: number;
  profile_url: string;
  avatar_url: string;
}

export class GitHubRepoAnalyzer {
  private octokit: Octokit;
  private owner: string;
  private repo: string;

  constructor(authToken: string, owner: string, repo: string) {
    this.octokit = new Octokit({ auth: authToken });
    this.owner = owner;
    this.repo = repo;
  }

  async analyzeRepository(): Promise<RepoAnalysis> {
    const [
      fileStructure,
      issues,
      pullRequests,
      contributors

    ] = await Promise.all([
      this.getFileStructure(),
      this.getIssues(),
      this.getPullRequests(),
      this.getTopContributors(),

    ]);

    return {
      fileStructure,
      issues,
      pullRequests,
      topContributors: contributors,

    };
  }

  private async getFileStructure(): Promise<TreeEntry[]> {
    try {
      const { data: repo } = await this.octokit.repos.get({
        owner: this.owner,
        repo: this.repo
      });

      const { data } = await this.octokit.git.getTree({
        owner: this.owner,
        repo: this.repo,
        tree_sha: repo.default_branch,
        recursive: 'true'
      });

      return data.tree as TreeEntry[];
    } catch (error) {
      console.error('Error fetching file structure:', error);
      return [];
    }
  }

  private async getIssues(): Promise<{ active: Issue[]; goodFirstIssues: Issue[]; helpWantedIssues: Issue[] }> {
    try {
      // Let's add type information for better debugging
      const [activeIssues, goodFirstIssues, helpWantedIssues] = await Promise.all([
        this.octokit.issues.listForRepo({
          owner: this.owner,
          repo: this.repo,
          state: 'open',
          per_page: 10
        }),
        this.octokit.issues.listForRepo({
          owner: this.owner,
          repo: this.repo,
          labels: 'good first issue',
          state: 'open',
          per_page: 10
        }),
        this.octokit.issues.listForRepo({
          owner: this.owner,
          repo: this.repo,
          labels: 'help wanted',
          state: 'open',
          per_page: 10
        })
      ]);

      // Add console.log to debug the raw data
    

      return {
        active: this.formatIssues(activeIssues.data),
        goodFirstIssues: this.formatIssues(goodFirstIssues.data),
        helpWantedIssues: this.formatIssues(helpWantedIssues.data)
      };
    } catch (error) {
      console.error('Error fetching issues:', error);
      return { active: [], goodFirstIssues: [], helpWantedIssues: [] };
    }
  }

  private async getPullRequests(): Promise<PullRequest[]> {
    try {
      const { data: prs } = await this.octokit.pulls.list({
        owner: this.owner,
        repo: this.repo,
        state: 'open',
        per_page: 10
      });

      return prs.map(pr => ({
        number: pr.number,
        title: pr.title,
        url: pr.html_url,
        state: pr.state,
        description: pr.body ? pr.body.slice(0, 200) + (pr.body.length > 200 ? '...' : '') : '',
        author: pr.user ? {
          login: pr.user.login,
          avatar_url: pr.user.avatar_url,
          profile_url: pr.user.html_url
        } : {
          login: 'unknown',
          avatar_url: '',
          profile_url: ''
        }
      }));
    } catch (error) {
      console.error('Error fetching pull requests:', error);
      return [];
    }
  }

  private async getTopContributors(): Promise<Contributor[]> {
    try {
      const { data: contributors } = await this.octokit.repos.listContributors({
        owner: this.owner,
        repo: this.repo,
        per_page: 10
      });

      return contributors
        .filter(contributor => contributor.login && contributor.html_url)
        .map(contributor => ({
          login: contributor.login!,
          contributions: contributor.contributions,
          profile_url: contributor.html_url!,
          avatar_url: contributor.avatar_url!
        }));
    } catch (error) {
      console.error('Error fetching contributors:', error);
      return [];
    }
  }

  private formatIssues(issues: any[]): Issue[] {
    return issues.map(issue => {
      // Add debug log right before returning the formatted issue
      const formattedIssue = {
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
        labels: issue.labels.map((label: any) => label.name),
        created_at: issue.created_at,
        description: issue.body ? issue.body.slice(0, 50) + (issue.body.length > 50 ? '...' : '') : '',
        author: {
          login: issue.user?.login || 'unknown',
          avatar_url: issue.user?.avatar_url || '',
          profile_url: issue.user?.html_url || ''
        }
      };

      
      return formattedIssue;
    });
  }
}