import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ datasourceUrl: "file:./dev.db" })

const departments = [
  "Engineering",
  "DevOps",
  "IT",
  "HR",
  "Finance",
  "Product",
  "Marketing",
  "Legal"
]

const employees = [
  { name: "Alice Smith", email: "alice@company.com", role: "Frontend Engineer", departmentName: "Engineering", skillTags: "React, Next.js, UI, Bug", averageResolutionTime: 45, currentLoad: 2, availability: "Available" },
  { name: "Bob Jones", email: "bob@company.com", role: "Backend Engineer", departmentName: "Engineering", skillTags: "Python, Database, Server, Bug", averageResolutionTime: 120, currentLoad: 5, availability: "Available" },
  { name: "Charlie DevOps", email: "charlie@company.com", role: "SysAdmin", departmentName: "DevOps", skillTags: "Server, Networking, Performance", averageResolutionTime: 60, currentLoad: 1, availability: "Busy" },
  { name: "Diana Prince", email: "diana@company.com", role: "IT Support", departmentName: "IT", skillTags: "Access, Hardware, Accounts", averageResolutionTime: 15, currentLoad: 0, availability: "Available" },
  { name: "Eve Davis", email: "eve@company.com", role: "HR Specialist", departmentName: "HR", skillTags: "Leave, Policy, Onboarding", averageResolutionTime: 30, currentLoad: 3, availability: "Available" },
  { name: "Frank Miller", email: "frank@company.com", role: "Accountant", departmentName: "Finance", skillTags: "Payroll, Reimbursement, Billing", averageResolutionTime: 180, currentLoad: 2, availability: "Available" },
  { name: "Grace Lee", email: "grace@company.com", role: "Product Manager", departmentName: "Product", skillTags: "Feature, Roadmap, Bugs", averageResolutionTime: 1440, currentLoad: 8, availability: "Busy" },
  { name: "Hank Pym", email: "hank@company.com", role: "Legal Counsel", departmentName: "Legal", skillTags: "Compliance, Contract, Policy", averageResolutionTime: 2880, currentLoad: 1, availability: "Available" },
  { name: "Ivy Vine", email: "ivy@company.com", role: "Marketing Manager", departmentName: "Marketing", skillTags: "Content, Branding, Social", averageResolutionTime: 120, currentLoad: 4, availability: "On Leave" },
]

async function main() {
  console.log('Seeding departments...');
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept },
      update: {},
      create: { name: dept }
    })
  }

  console.log('Seeding employees...');
  for (const emp of employees) {
    const department = await prisma.department.findUnique({
      where: { name: emp.departmentName }
    })
    
    if (department) {
      await prisma.employee.upsert({
        where: { email: emp.email },
        update: {
          name: emp.name,
          role: emp.role,
          skillTags: emp.skillTags,
          departmentId: department.id,
          availability: emp.availability
        },
        create: {
          name: emp.name,
          email: emp.email,
          role: emp.role,
          skillTags: emp.skillTags,
          departmentId: department.id,
          averageResolutionTime: emp.averageResolutionTime,
          currentLoad: emp.currentLoad,
          availability: emp.availability
        }
      })
    }
  }

  console.log('Seed completed.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
