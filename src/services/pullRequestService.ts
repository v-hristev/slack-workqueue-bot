import axios from "axios";

export class PullRequestService {

    private _githubToken: string;

    constructor(githubToken: string | null | undefined) {
        if (!githubToken) {
            throw new Error("GitHub Token not defined");
        }
        this._githubToken = githubToken;
    }

    extractRepoAndPR(url: string) {
        // Regular expression to match the parts of the URL
        const regex = /https:\/\/github\.com\/([^/]+)\/([^/]+)\/pull[s]*\/(\d+)/;
        const match = url.match(regex);

        if (match) {
            const owner = match[1];
            const repo = match[2];
            const prNumber = +match[3];

            return {
                owner,
                repo,
                prNumber
            };
        } else {
            throw new Error("Invalid GitHub PR URL");
        }
    }

    async fetchPR(owner: string, repo: string, prNumber: number) {
        try {
            const url = `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`;
            const response = await axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this._githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            // Log the PR summary
            return response.data;
        } catch (error: any) {
            console.error(`Error fetching PR: ${error.response ? error.response.status : error.message}`);
        }
    }
}
