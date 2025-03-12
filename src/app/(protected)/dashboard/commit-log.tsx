'use client'
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
const CommitLog = () => {
    const { projectId, project } = useProject();
    const { data: commits } = api.project.getCommits.useQuery({ projectId });
    return (
        <>
            <ul className="space-y-6">
                {commits?.map((commit, commitIdx) => {
                    return <li key={commit.id} className="relative flex gap-x-4">
                        <div className={cn(
                            commitIdx === commits.length - 1 ? 'h-6' : '-bottom-6', 'absolute left-0 top-0 flex w-6 justify-center'
                        )}>
                            <div className="w-px translate-x-1 bg-gray-200"></div>
                        </div>

                        <>
                            <img src={commit.commitAuthorAvatar} alt='commit avatar' className="relative mt-4 size-8 flex-none rounded-full bg-gray-500" />
                            <div className="flex-auto rounded-mg bg-white p-3 ring-1 ring-insert ring-gray-200">
                                <div className="flex jyustify-between gap-x-4">
                                    <Link target="_blank" href={`${project?.githubUrl}/commit/${commit.commitHash}`} className="text-xs py-0. 5  leading-5   gap-x-2 text-gray-500">
                                        <span className="font-medium text-gray-900">
                                            {commit.commitAuthorName}
                                        </span>{" "}
                                        <span className="inline-flex items-center">
                                            committed
                                            <ExternalLink className="ml-1 size-4" />
                                        </span>
                                        {commit.commitMsg}
                                    </Link>
                                </div>
                                <span className="font-semibold">
                                    {commit.commitMsg}
                                </span>
                                <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                                    {commit.summary}
                                </pre>
                            </div>
                        </>
                    </li>

                })}

            </ul>
        </>
    )
}

export default CommitLog;