import { PrismaClient } from "@/src/generated/client";


export const prisma = new PrismaClient();

const connectDB = async () => {
     try {
          await prisma.$connect();
          console.log('MongoDB connected successfully!!!')
     } catch (error) {
           console.error("❌ MongoDB connection failed:", error);
     }
}

connectDB();