import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummariseCommit } from "./gemini";
const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});
const githubUrl = 'https://github.com/docker/genai-stack'

type Response = {
    commitHash: string;
    commitMsg: string;
    commitAuthorName: string;
    commitAuthorAvatar: string;
    commitDate: string;
};

export const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
    const [owner, repo] = githubUrl.split('/').slice(-2);
    if(!owner || !repo){
        throw new Error('Invalid github URL')
    }
    const { data } = await octokit.rest.repos.listCommits({
        owner,
        repo
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
    // console.log(unprocessedCommits)
// const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit=>{
//     return summariseCommit(githubUrl, commit.commitHash)
// }))

const summaryResponses = await Promise.allSettled(unprocessedCommits.map(commit=>{
    return summariseCommit(githubUrl, commit.commitHash)
}))
const summaries =summaryResponses.map((response) => {
    if(response.status === 'fulfilled'){
        return response.value as string
    }
    return ''
})

const commits = await db.commit.createMany({
        data: summaries.map((summary, index) => {
            console.log(`procesing commit ${index}`)
            return {
            projectId,
            commitHash: unprocessedCommits[index]!.commitHash,
            commitMsg: unprocessedCommits[index]!.commitMsg,
            commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
            commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
            commitDate: unprocessedCommits[index]!.commitDate,
            summary
            }
        })
    });

    return unprocessedCommits;
}


async function summariseCommit(githubUrl: string, commitHash:string){
    const {data} = await axios.get(`${githubUrl}/commit/${commitHash}.diff`,{
        headers:{
            Accept: 'application/vnd.github.v3.diff'
        }
    })
    return await aiSummariseCommit(data)
}

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

// pollCommits('cm7xfe5910000l7ykkwm5o9ip')