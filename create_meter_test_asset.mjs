// Create a test asset with meter readings for feature #243
import { config } from 'dotenv';
config({ path: 'backend/.env' });
const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();

async function createMeterTestAsset() {
  try {
    console.log('Creating test asset with meter readings...');

    // Find ACTS program
    const actsProgram = await prisma.program.findFirst({
      where: { pgm_cd: 'ACTS' }
    });

    if (!actsProgram) {
      throw new Error('ACTS program not found');
    }

    // Find or create a part
    let part = await prisma.part.findFirst({
      where: { partno: 'TEST-METER-001' }
    });

    if (!part) {
      part = await prisma.part.create({
        data: {
          partno: 'TEST-METER-001',
          noun: 'Test Part for Meter History Feature 243',
          sys_type: '10',
          pgm_id: actsProgram.pgm_id,
          nomenclature: 'Test Meter Asset',
          ins_by: 'SYSTEM',
          ins_date: new Date(),
          active: true
        }
      });
      console.log('Created part:', part.partno);
    }

    // Create an asset with meter tracking
    const asset = await prisma.asset.create({
      data: {
        serno: 'TEST-METER-243-001',
        partno_id: part.partno_id,
        pgm_id: actsProgram.pgm_id,
        status_cd: 'FMC',
        admin_loc: '743',
        cust_loc: '743',
        meter_type: 'hours',
        eti_hours: 100,
        mfg_date: new Date('2024-01-01'),
        acceptance_date: new Date('2024-01-15'),
        notes: 'Test asset for feature #243 - ETM meter history tracking',
        remarks: 'Created for testing meter history feature',
        active: true,
        ins_by: 'SYSTEM',
        ins_date: new Date(),
        chg_by: 'SYSTEM',
        chg_date: new Date()
      }
    });
    console.log('Created asset:', asset.serno, 'ID:', asset.asset_id, 'with meter type:', asset.meter_type, 'and current reading:', asset.eti_hours);

    // Create a maintenance event
    const event = await prisma.maintenanceEvent.create({
      data: {
        asset_id: asset.asset_id,
        job_no: 'MX-TEST-243-001',
        discrepancy: 'Test maintenance for meter history verification',
        start_job: new Date(),
        event_type: 'Standard',
        priority: 'Routine',
        status: 'open',
        ins_by: 'SYSTEM',
        ins_date: new Date(),
        chg_by: 'SYSTEM',
        chg_date: new Date()
      }
    });
    console.log('Created maintenance event:', event.job_no, 'ID:', event.event_id);

    // Create a repair with ETI meter readings
    const repair = await prisma.repair.create({
      data: {
        event_id: event.event_id,
        asset_id: asset.asset_id,
        start_date: new Date(),
        type_maint: 'Scheduled',
        shop_status: 'open',
        eti_in: 100,  // Meter reading at start
        eti_out: 125, // Meter reading at end
        eti_delta: 25, // Hours added
        narrative: 'Test repair with ETI meter readings to verify feature #243',
        tech_name: 'John Admin',
        created_at: new Date()
      }
    });
    console.log('Created repair with meter readings - ETI In:', repair.eti_in, 'ETI Out:', repair.eti_out, 'Delta:', repair.eti_delta);

    // Close the event and repair
    await prisma.repair.update({
      where: { repair_id: repair.repair_id },
      data: {
        shop_status: 'closed',
        stop_date: new Date()
      }
    });

    await prisma.maintenanceEvent.update({
      where: { event_id: event.event_id },
      data: {
        status: 'closed',
        stop_job: new Date()
      }
    });

    // Update asset's current meter reading
    await prisma.asset.update({
      where: { asset_id: asset.asset_id },
      data: {
        eti_hours: 125
      }
    });

    console.log('\n✅ SUCCESS! Created test data for feature #243:');
    console.log('- Asset:', asset.serno, '(ID:', asset.asset_id + ')');
    console.log('- Meter Type:', asset.meter_type);
    console.log('- Current Reading:', asset.eti_hours, 'hours');
    console.log('- Event:', event.job_no);
    console.log('- Repair with ETI In:', repair.eti_in, 'ETI Out:', repair.eti_out, 'Delta:', repair.eti_delta);
    console.log('\nYou can now view the meter history at:');
    console.log(`http://localhost:5173/assets/${asset.asset_id}?tab=meters`);

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createMeterTestAsset();
