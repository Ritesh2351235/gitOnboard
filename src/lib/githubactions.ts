import { GitHubRepoAnalyzer } from './repodetails';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function analyzeGitHubRepository(owner: string, repo: string) {
    // Get GitHub token from environment variable
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
        throw new Error('GitHub token not found in environment variables');
    }

    try {
        console.log(`Starting analysis of ${owner}/${repo}...`);

        // Initialize the analyzer
        const analyzer = new GitHubRepoAnalyzer(githubToken, owner, repo);

        // Get all repository information
        const analysis = await analyzer.analyzeRepository();

        console.log(analysis);
        // Display file structure
        /* console.log('\n📁 Repository Structure:');
        analysis.fileStructure.forEach(file => {
            console.log(`${file.type === 'tree' ? '📂' : '📄'} ${file.path}`);
        });

        // Display issues
        console.log('\n🐛 Active Issues:');
        analysis.issues.active.forEach(issue => {
            console.log(`
            #${issue.number}: ${issue.title}
            Author: ${issue.author.login} (${issue.author.profile_url})
            Description: ${issue.description}
            Labels: ${issue.labels.join(', ')}
            URL: ${issue.url}
            -------------------------------------`);
        });

        // Display good first issues
        console.log('\n🎯 Good First Issues:');
        analysis.issues.goodFirstIssues.forEach(issue => {
            console.log(`
                #${issue.number}: ${issue.title}
                Author: ${issue.author.login} (${issue.author.profile_url})
                Description: ${issue.description}
                URL: ${issue.url}
                --------------------------------------`);
        });

        // Display help wanted issues
        console.log('\n🤔 Help Wanted Issues:');
        analysis.issues.helpWantedIssues.forEach(issue => {
            console.log(`
                #${issue.number}: ${issue.title}
                Author: ${issue.author.login} (${issue.author.profile_url})
                Description: ${issue.description}
                URL: ${issue.url}
                --------------------------------------`);
        });

        // Display pull requests
        console.log('\n🔄 Pull Requests:');
        analysis.pullRequests.forEach(pr => {
            console.log(`
            #${pr.number}: ${pr.title}
            Author: ${pr.author.login} (${pr.author.profile_url})
            Description: ${pr.description}
            URL: ${pr.url}
            -------------------------------------`);
        });

        // Display top contributors
        
        console.log('\n👥 Top Contributors:');

        analysis.topContributors.forEach(contributor => {
            console.log(`- ${contributor.login}: ${contributor.contributions} contributions`);
        });

        // Display community engagement
        

        // Save results to a file (optional)
        const timestamp = new Date().toISOString().replace(/[:]/g, '-');
        const fs = require('fs');
        fs.writeFileSync(
            `repo-analysis-${owner}-${repo}-${timestamp}.json`,
            JSON.stringify(analysis, null, 2)
        );

        console.log('\n✅ Analysis complete! Results have been saved to file.');
 */
    } catch (error) {
        console.error('❌ Error during analysis:', error);
    }
}

// Example usage
const owner = 'json-schema-org';  // Replace with repository owner
const repo = 'website';      // Replace with repository name

analyzeGitHubRepository(owner, repo);