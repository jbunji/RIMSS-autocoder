const { PrismaClient } = require('./backend/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function checkHistory() {
  try {
    // Check parts order #8 (O-Ring Seal Kit)
    console.log('Checking Parts Order #8 (O-Ring Seal Kit) - RECEIVED status');
    console.log('='.repeat(80));

    const order = await prisma.partsOrder.findUnique({
      where: { parts_order_id: 8 },
      include: {
        requestor: true,
        acknowledgedBy: true,
        filledBy: true,
        receivedBy: true
      }
    });

    if (!order) {
      console.log('Order not found');
      return;
    }

    console.log('\nOrder Details:');
    console.log('- Order ID:', order.parts_order_id);
    console.log('- Part:', order.part_name);
    console.log('- Status:', order.status);
    console.log('- Order Date:', order.order_date);
    console.log('');

    console.log('History Timestamps:');
    console.log('1. REQUEST:');
    console.log('   - Date:', order.order_date);
    console.log('   - User:', order.requestor?.username || 'Unknown');
    console.log('');

    console.log('2. ACKNOWLEDGE:');
    console.log('   - Date:', order.acknowledged_date);
    console.log('   - User:', order.acknowledgedBy?.username || 'Not set');
    console.log('');

    console.log('3. FILL:');
    console.log('   - Date:', order.filled_date);
    console.log('   - User:', order.filledBy?.username || 'Not set');
    console.log('');

    console.log('4. DELIVER/RECEIVE:');
    console.log('   - Date:', order.received_date);
    console.log('   - User:', order.receivedBy?.username || 'Not set');
    console.log('');

    // Check PartsOrderHistory table
    const history = await prisma.partsOrderHistory.findMany({
      where: { parts_order_id: 8 },
      include: { user: true },
      orderBy: { changed_at: 'asc' }
    });

    console.log('\nPartsOrderHistory Records:', history.length);
    console.log('='.repeat(80));

    if (history.length === 0) {
      console.log('❌ NO HISTORY RECORDS FOUND!');
    } else {
      history.forEach((entry, index) => {
        console.log(`\n${index + 1}. ${entry.action_type}`);
        console.log('   - Date:', entry.changed_at);
        console.log('   - User:', entry.user?.username || 'Unknown');
        console.log('   - Changes:', entry.changes);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkHistory();
