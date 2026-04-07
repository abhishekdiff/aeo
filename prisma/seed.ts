import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { SAMPLE_PROJECT, SAMPLE_COMPETITORS, SAMPLE_QUERIES } from '../src/lib/sample-data'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../.env') })

const dbUrl = process.env.DATABASE_URL || 'file:./prisma/dev.db'
const adapter = new PrismaLibSql({ url: dbUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Check if sample project already exists
  const existing = await prisma.project.findFirst({
    where: { name: SAMPLE_PROJECT.name }
  })

  if (existing) {
    console.log('Sample project already exists, skipping seed.')
    return
  }

  // Create sample project
  const project = await prisma.project.create({
    data: {
      ...SAMPLE_PROJECT,
      competitors: {
        create: SAMPLE_COMPETITORS,
      },
      queries: {
        create: SAMPLE_QUERIES,
      },
    },
  })

  console.log(`Created project: ${project.name} (${project.id})`)
  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
