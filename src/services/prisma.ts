import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createSingleton } from '../utils/create-singleton'

export const prisma = createSingleton('prisma', () => new PrismaClient().$extends(withAccelerate()), false)
