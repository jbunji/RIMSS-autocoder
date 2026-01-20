import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDeletedEvent() {
  try {
    // Check if the deleted event exists
    const deletedEvent = await prisma.maintenanceEvent.findFirst({
      where: { job_number: 'MX-2024-001' }
    });

    console.log('Deleted event MX-2024-001:', deletedEvent ? 'STILL EXISTS (PROBLEM!)' : 'Properly deleted ✓');

    // Check if there are any orphaned repairs (repairs without a maintenance event)
    const allRepairs = await prisma.repair.findMany({
      include: { maintenanceEvent: true }
    });

    const orphanedRepairs = allRepairs.filter(r => !r.maintenanceEvent);
    console.log('Orphaned repairs (should be 0):', orphanedRepairs.length);

    if (orphanedRepairs.length > 0) {
      console.log('WARNING: Found orphaned repairs:', orphanedRepairs.map(r => ({ id: r.id, maint_event_id: r.maint_event_id })));
    } else {
      console.log('No orphaned repairs found ✓');
    }

    // Count total repairs in the system
    const totalRepairs = await prisma.repair.count();
    console.log('Total repairs in system:', totalRepairs);

  } catch (error) {
    console.error('Error checking deletion:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDeletedEvent();
