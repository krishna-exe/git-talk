"use client";

import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Commitlog from "./commit-log";
import Link from "next/link";
// import React from "react";

const DashboardPage = () => {
    // const { user } = useUser();
    const { project } = useProject();
    return (
        <div>
            {/* {project?.id} */}
            <div className="flex items-center justify-between flex-wrap gap-y-4">
                <div className="w-fit rounded-md bg-primary px-4 py-3">
                    <div className="flex items-center">

                    <Github className="size-5 text-white"/>
                    <div className="ml-2">
                        <p className="text-sm font-medium text-white">
                            This project is linked to {' '}
                            <Link href={project?.githubUrl ?? ""} className='inline-flex item-center text-white/80 hover:underline'>
                            {project?.githubUrl}
                            <ExternalLink className="ml-1 size-4"/>
                            </Link>

                        </p>
                    </div>
                    </div>
                </div>
                <div className="h-4"></div>
                <div className="flex items-center gap-4">
                    {/* Team members
                    InviteButton
                    Archivebitton */}
                </div>

            </div>

            <div className="mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-5">
                    {/* Askquestioncard */}
                    {/* meeting */}
                </div>
            </div>
            <div className="mt-8">
                <Commitlog/>
            </div>
        </div>
    );
}

export default DashboardPage;