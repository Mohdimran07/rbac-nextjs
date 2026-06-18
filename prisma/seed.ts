import "dotenv/config";

import { PrismaClient } from "@/src/generated/client";
import { Role } from "./generated/enums";
import { hashPassword } from "@/app/lib/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: "Engineering",
        description: "Software development team",
        code: "ENG-2026",
      },
    }),

    prisma.team.create({
      data: {
        name: "Marketing",
        description: "Marketing and Sales team",
        code: "MKT-2026",
      },
    }),
    prisma.team.create({
      data: {
        name: "Operations",
        description: "Business operations team",
        code: "OPS-2026",
      },
    }),
  ]);

  const sampleUsers = [
    {
      name: "Alex Rivera",
      email: "alex.rivera@company.com",
      team: teams[0],
      role: Role.MANAGER,
    },
    {
      name: "Sarah Chen",
      email: "sarah.chen@company.com",
      team: teams[0],
      role: Role.USER,
    },
    {
      name: "Marcus Johnson",
      email: "marcus.johnson@company.com",
      team: teams[1],
      role: Role.MANAGER,
    },
    {
      name: "Elena Rostova",
      email: "elena.rostova@company.com",
      team: teams[1],
      role: Role.USER,
    },
    {
      name: "David Kim",
      email: "david.kim@company.com",
      team: teams[2],
      role: Role.MANAGER,
    },
    {
      name: "Aisha Diallo",
      email: "aisha.diallo@company.com",
      team: teams[2],
      role: Role.USER,
    },
    {
      name: "Carlos Mendez",
      email: "carlos.mendez@company.com",
      team: teams[0],
      role: Role.USER,
    },
    {
      name: "Chloe Dupont",
      email: "chloe.dupont@company.com",
      team: teams[0],
      role: Role.USER,
    },
    {
      name: "James Wilson",
      email: "james.wilson@company.com",
      team: teams[1],
      role: Role.USER,
    },
    {
      name: "Priya Patel",
      email: "priya.patel@company.com",
      team: teams[2],
      role: Role.USER,
    },
  ];

  for (const user of sampleUsers) {
    await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: await hashPassword("123456"),
        role: user.role,
        teamId: user.team.id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((err) => {
    console.log("err at seeding:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
