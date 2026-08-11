import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

const ManagerPage = async () => {
  const user = await getCurrentUser();

  if (!user || !checkUserPermission(user, Role.ADMIN)) {
    redirect("/unauthroized");
  }

  const prismaMyTeamMembers = user?.teamId
    ? prisma.user.findMany({
        where: {
          teamId: user.teamId,
          role: { not: Role.ADMIN },
        },
        include: {
          team: true,
        },
      })
    : [];

  const prismaAllTeamMembers = prisma.user.findMany({
    where: {
      role: { not: Role.ADMIN },
    },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          description: true,
          code: true,
        },
      },
    },
    orderBy: {
      teamId: "desc",
    },
  });

  //   return <ManagerDashboard myTeamMemebers={prismaMyTeamMembers} allTeamMembers={prismaAllTeamMembers} currentUser={user} />
  return <div>ManagerPage</div>;
};

export default ManagerPage;
