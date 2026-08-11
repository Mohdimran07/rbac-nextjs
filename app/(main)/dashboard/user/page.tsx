import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/src/generated/enums";
import { redirect } from "next/navigation";

const UserPage = async () => {
  const user = await getCurrentUser();
  console.log("user: ", user);

  if (!user) {
    redirect("/login");
  }

  const teamMembers = user?.teamId
    ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      })
    : [];

  //   return <UserDashboard teamMemebers={teamMembers} currentUser={user} />;
  return <div>UserPage</div>;
};

export default UserPage;
