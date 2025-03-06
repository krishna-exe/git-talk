import { db } from "@/server/db";
import { Octokit } from "octokit";

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});
const githubUrl = 'https://github.com/docker.genai-stack'

type Response = {
    commitHash: string;
    commitMsg: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
};

export const getCommitHashes = async (githubUrl: string | undefined): Promise<Response[]> => {
    const { data } = await octokit.rest.repos.listCommits({
        owner: 'docker',
        repo: 'genai-stack',
    });

    const sortedCommits = data.sort((a: any, b: any) => 
        new Date(b.commit.author.date).getTime() - new Date(a.commit.author.date).getTime()
    );

    return sortedCommits.slice(0, 15).map((commit: any) => ({
        commitHash: commit.sha,
        commitMsg: commit.commit.message,
        commitAuthorName: commit.commit.author.name,
        commitAuthorAvatar: commit.author.avatar_url,
        commitDate: commit.commit.author.date,
    }));
};

export const pollCommits = async(projectId: string)=>{
    const {project, githubUrl} = await fetchProjectGithubUrl(projectId)
    const commitHashes = await getCommitHashes(githubUrl)
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes)
    console.log(unprocessedCommits)
    return unprocessedCommits
}

async function summariseCommit(githubUrl)

async function fetchProjectGithubUrl(projectId: string){
    const project = await db.project.findUnique({
        where: {id:projectId},
        select:{
            githubUrl:true
        }
    })
    return {project, githubUrl: project?.githubUrl}
}

async function filterUnprocessedCommits(projectId:string, commitHashes:Response[]){
    const processedCommits = await db.commit.findMany({
        where:{projectId}
    })
    const unprocessedCommits = commitHashes.filter((commit)=>!processedCommits.some(processedCommit=>processedCommit.commitHash===commit.commitHash))
return unprocessedCommits
}

pollCommits('cm7wttct00003l75spmdqwc8l')