'use client'
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const CommitLog = () => {
    const { projectId, project } = useProject();
    const { data: commits } = api.project.getCommits.useQuery(
        { projectId },
        {
            select: (data) => 
                // Sort commits by date in descending order (newest first)
                [...data].sort((a, b) => 
                    new Date(b.commitDate).getTime() - new Date(a.commitDate).getTime()
                )
        }
    );

    if (!commits?.length) {
        return <div className="text-center text-gray-500">No commits found</div>;
    }

    return (
        <ul className="space-y-6">
            {commits.map((commit, commitIdx) => (
                <li key={commit.id} className="relative flex gap-x-4">
                    <div className={cn(
                        commitIdx === commits.length - 1 ? 'h-6' : '-bottom-6',
                        'absolute left-0 top-0 flex w-6 justify-center'
                    )}>
                        <div className="w-px translate-x-1 bg-gray-200" />
                    </div>

                    <div className="flex flex-1 gap-x-4">
                        <img 
                            src={commit.commitAuthorAvatar} 
                            alt={`${commit.commitAuthorName}'s avatar`}
                            className="relative mt-4 size-8 flex-none rounded-full bg-gray-500"
                        />
                        <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200">
                            <div className="flex justify-between gap-x-4">
                                <Link 
                                    target="_blank"
                                    href={`${project?.githubUrl}/commit/${commit.commitHash}`}
                                    className="text-xs py-0.5 leading-5 gap-x-2 text-gray-500 hover:text-gray-700"
                                >
                                    <span className="font-medium text-gray-900">
                                        {commit.commitAuthorName}
                                    </span>{" "}
                                    <span className="inline-flex items-center">
                                        committed
                                        <ExternalLink className="ml-1 size-4" />
                                    </span>
                                </Link>
                                <time 
                                    dateTime={new Date(commit.commitDate).toISOString()}
                                    className="flex-none text-xs text-gray-500"
                                >
                                    {new Date(commit.commitDate).toLocaleDateString()}
                                </time>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-gray-900">
                                {commit.commitMsg}
                            </p>
                            {commit.summary && (
                                <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                                    {commit.summary}
                                </pre>
                            )}
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default CommitLog;