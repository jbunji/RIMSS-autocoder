const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAuditLogs() {
  try {
    // Get all audit logs, ordered by most recent first
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        created_at: 'desc'
      },
      take: 10,
      include: {
        user: {
          select: {
            username: true,
            first_name: true,
            last_name: true
          }
        }
      }
    });

    console.log(`\n=== Found ${logs.length} Audit Log Entries ===\n`);

    logs.forEach((log, index) => {
      console.log(`${index + 1}. Log ID: ${log.log_id}`);
      console.log(`   User: ${log.user?.username || 'Unknown'} (ID: ${log.user_id})`);
      console.log(`   Action: ${log.action}`);
      console.log(`   Table: ${log.table_name}`);
      console.log(`   Record ID: ${log.record_id}`);
      console.log(`   IP Address: ${log.ip_address}`);
      console.log(`   Timestamp: ${log.created_at.toISOString()}`);

      if (log.old_values) {
        console.log(`   Old Values:`, JSON.stringify(log.old_values, null, 2));
      }

      if (log.new_values) {
        console.log(`   New Values:`, JSON.stringify(log.new_values, null, 2));
      }

      console.log('');
    });

  } catch (error) {
    console.error('Error querying audit logs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAuditLogs();
