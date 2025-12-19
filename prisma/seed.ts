import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clean existing data (in development only)
  console.log('🧹 Cleaning existing data...');
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.note.deleteMany();
  await prisma.document.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.clientUser.deleteMany();
  await prisma.client.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.firm.deleteMany();

  // Create Firm
  console.log('🏢 Creating firm...');
  const firm = await prisma.firm.create({
    data: {
      name: 'Smith & Associates Legal',
      slug: 'smith-associates',
      address: '123 Legal Avenue, Suite 500, Dallas, TX 75201',
      phone: '(214) 555-0100',
      website: 'https://smithlegal.example.com',
    },
  });
  console.log(`   Created firm: ${firm.name}`);

  // Create Admin User
  console.log('\n👤 Creating users...');
  const adminPassword = await hashPassword('Admin123!');
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@dealpilot.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      title: 'System Administrator',
      firmId: firm.id,
    },
  });
  console.log(`   Created admin: ${admin.email}`);

  // Create Attorney Users
  const attorneyPassword = await hashPassword('Attorney123!');
  const attorney1 = await prisma.user.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@smithlegal.com',
      passwordHash: attorneyPassword,
      role: 'ATTORNEY',
      status: 'ACTIVE',
      title: 'Senior Partner',
      phone: '(214) 555-0101',
      firmId: firm.id,
    },
  });
  console.log(`   Created attorney: ${attorney1.email}`);

  const attorney2 = await prisma.user.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@smithlegal.com',
      passwordHash: attorneyPassword,
      role: 'ATTORNEY',
      status: 'ACTIVE',
      title: 'Associate Attorney',
      phone: '(214) 555-0102',
      firmId: firm.id,
    },
  });
  console.log(`   Created attorney: ${attorney2.email}`);

  // Create Clients
  console.log('\n🏛️ Creating clients...');
  const client1 = await prisma.client.create({
    data: {
      name: 'Acme Properties LLC',
      type: 'LLC',
      address: '456 Commerce Street, Dallas, TX 75202',
      phone: '(214) 555-0200',
      email: 'info@acmeproperties.com',
      website: 'https://acmeproperties.example.com',
      firmId: firm.id,
    },
  });
  console.log(`   Created client: ${client1.name}`);

  const client2 = await prisma.client.create({
    data: {
      name: 'Sunrise Investments Corp',
      type: 'Corporation',
      address: '789 Investment Boulevard, Houston, TX 77001',
      phone: '(713) 555-0300',
      email: 'contact@sunriseinv.com',
      firmId: firm.id,
    },
  });
  console.log(`   Created client: ${client2.name}`);

  // Create Client Users
  console.log('\n👥 Creating client users...');
  const clientPassword = await hashPassword('Client123!');
  const clientUser1 = await prisma.user.create({
    data: {
      name: 'Mike Wilson',
      email: 'mike@acmeproperties.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      status: 'ACTIVE',
      title: 'CEO',
      phone: '(214) 555-0201',
      clientId: client1.id,
    },
  });
  console.log(`   Created client user: ${clientUser1.email}`);

  const clientUser2 = await prisma.user.create({
    data: {
      name: 'Lisa Chen',
      email: 'lisa@sunriseinv.com',
      passwordHash: clientPassword,
      role: 'CLIENT',
      status: 'ACTIVE',
      title: 'VP of Acquisitions',
      phone: '(713) 555-0301',
      clientId: client2.id,
    },
  });
  console.log(`   Created client user: ${clientUser2.email}`);

  // Assign Attorneys to Clients
  console.log('\n🔗 Assigning attorneys to clients...');
  await prisma.clientUser.create({
    data: {
      attorneyId: attorney1.id,
      clientId: client1.id,
      isPrimary: true,
    },
  });
  await prisma.clientUser.create({
    data: {
      attorneyId: attorney2.id,
      clientId: client1.id,
      isPrimary: false,
    },
  });
  await prisma.clientUser.create({
    data: {
      attorneyId: attorney1.id,
      clientId: client2.id,
      isPrimary: true,
    },
  });
  console.log('   Attorney assignments created');

  // Create Sample Deals
  console.log('\n📋 Creating sample deals...');
  const deal1 = await prisma.deal.create({
    data: {
      name: 'Downtown Office Building Acquisition',
      description:
        'Acquisition of a 15-story Class A office building in downtown Dallas.',
      propertyType: 'OFFICE',
      transactionType: 'ACQUISITION',
      status: 'DUE_DILIGENCE',
      priority: 'HIGH',
      propertyAddress: '100 Main Street',
      propertyCity: 'Dallas',
      propertyState: 'TX',
      propertyZip: '75201',
      purchasePrice: 45000000,
      earnestMoney: 1000000,
      contractDate: new Date('2024-01-15'),
      dueDiligenceEnd: new Date('2024-02-28'),
      closingDate: new Date('2024-03-30'),
      clientId: client1.id,
      createdById: attorney1.id,
    },
  });
  console.log(`   Created deal: ${deal1.name}`);

  const deal2 = await prisma.deal.create({
    data: {
      name: 'Retail Shopping Center',
      description: 'Disposition of a 200,000 SF retail shopping center.',
      propertyType: 'RETAIL',
      transactionType: 'DISPOSITION',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      propertyAddress: '500 Shopping Lane',
      propertyCity: 'Houston',
      propertyState: 'TX',
      propertyZip: '77001',
      purchasePrice: 28000000,
      clientId: client2.id,
      createdById: attorney1.id,
    },
  });
  console.log(`   Created deal: ${deal2.name}`);

  // Create Milestones
  console.log('\n🎯 Creating milestones...');
  const milestone1 = await prisma.milestone.create({
    data: {
      name: 'Due Diligence Period',
      description: 'Complete all due diligence items',
      dueDate: new Date('2024-02-28'),
      dealId: deal1.id,
      sortOrder: 1,
    },
  });

  const milestone2 = await prisma.milestone.create({
    data: {
      name: 'Title Review',
      description: 'Review and approve title commitment',
      dueDate: new Date('2024-02-15'),
      dealId: deal1.id,
      sortOrder: 2,
    },
  });
  console.log('   Milestones created');

  // Create Tasks
  console.log('\n✅ Creating tasks...');
  await prisma.task.createMany({
    data: [
      {
        title: 'Review Purchase Agreement',
        description: 'Review and analyze the purchase agreement for key terms',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date('2024-01-20'),
        completedAt: new Date('2024-01-19'),
        dealId: deal1.id,
        milestoneId: milestone1.id,
        assigneeId: attorney1.id,
        createdById: attorney1.id,
        sortOrder: 1,
      },
      {
        title: 'Order Title Commitment',
        description: 'Order title commitment from title company',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date('2024-01-22'),
        completedAt: new Date('2024-01-21'),
        dealId: deal1.id,
        milestoneId: milestone2.id,
        assigneeId: attorney2.id,
        createdById: attorney1.id,
        sortOrder: 2,
      },
      {
        title: 'Review Environmental Reports',
        description: 'Review Phase I and Phase II environmental reports',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date('2024-02-15'),
        dealId: deal1.id,
        milestoneId: milestone1.id,
        assigneeId: attorney1.id,
        createdById: attorney1.id,
        sortOrder: 3,
      },
      {
        title: 'Review Survey',
        description: 'Review ALTA survey for encroachments and easements',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2024-02-20'),
        dealId: deal1.id,
        milestoneId: milestone1.id,
        assigneeId: attorney2.id,
        createdById: attorney1.id,
        sortOrder: 4,
      },
      {
        title: 'Prepare Closing Checklist',
        description: 'Create comprehensive closing checklist',
        status: 'TODO',
        priority: 'LOW',
        dueDate: new Date('2024-03-15'),
        dealId: deal1.id,
        assigneeId: attorney2.id,
        createdById: attorney1.id,
        sortOrder: 5,
      },
    ],
  });
  console.log('   Tasks created');

  // Create Notes
  console.log('\n📝 Creating notes...');
  await prisma.note.createMany({
    data: [
      {
        title: 'Initial Client Meeting Notes',
        content:
          'Met with Mike Wilson to discuss acquisition strategy. Client is looking for long-term hold. Primary concerns are parking ratio and building condition.',
        isPinned: true,
        dealId: deal1.id,
        userId: attorney1.id,
      },
      {
        title: 'Title Review Findings',
        content:
          'Identified minor encroachment on east property line. Need to review with surveyor and determine if curative action required.',
        dealId: deal1.id,
        userId: attorney2.id,
      },
    ],
  });
  console.log('   Notes created');

  console.log('\n✨ Seed completed successfully!\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                     TEST CREDENTIALS');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('\n📧 Admin Account:');
  console.log('   Email:    admin@dealpilot.com');
  console.log('   Password: Admin123!');
  console.log('\n📧 Attorney Account:');
  console.log('   Email:    john.smith@smithlegal.com');
  console.log('   Password: Attorney123!');
  console.log('\n📧 Client Account:');
  console.log('   Email:    mike@acmeproperties.com');
  console.log('   Password: Client123!');
  console.log('\n═══════════════════════════════════════════════════════════════\n');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
