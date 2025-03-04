"use client";

import { useUser } from "@clerk/nextjs";

const DashboardPage = () => {
    const { user } = useUser();
    return (
        <div>{user?.firstName}</div>
    );
}

export default DashboardPage;