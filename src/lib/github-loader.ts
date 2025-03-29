import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github'
export const loadGithubRepo = async (githubUrl: string, githubToken?: string)=>{
    const loader= new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || '',
        branch: 'main',
        ignoreFiles: ['package.json', 'package-lock.json', 'yarn.lock', 'bun.lockb'],
        recursive: true,
        unknown:'warn',
        maxConcurrency: 5
    })
    const docs =  await loader.load()
    return docs
}

console.log(await loadGithubRepo('https://github.com/krishna-exe/git-talk'))

