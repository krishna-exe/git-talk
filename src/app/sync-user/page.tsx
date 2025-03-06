import { db } from "@/server/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

const SyncUser = async () => {
    try {
        const { userId } = await auth();
        if (!userId) {
            throw new Error('User not found');
        }

        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        if (!user.emailAddresses[0]?.emailAddress) {
            return notFound();
        }

        const result = await db.user.upsert({
            where: {
                emailAddress: user.emailAddresses[0]?.emailAddress ?? ""
            },
            update: {
                imageUrl: user.imageUrl,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            create: {
                id: userId,
                emailAddress: user.emailAddresses[0].emailAddress ?? "",
                imageUrl: user.imageUrl,
                firstName: user.firstName,
                lastName: user.lastName,
            },
        });

        console.log('Upsert result:', result);

        // Return a success message instead of redirecting
        return { success: true };
    } catch (error) {
        console.error('Error during user sync:', error);
        throw error;
    }
};

export default SyncUser;