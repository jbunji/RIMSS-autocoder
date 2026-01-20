import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed 1000 spare parts...');

  // Get the CRIIS program
  const criisProgram = await prisma.program.findFirst({
    where: { pgm_cd: 'CRIIS' }
  });

  if (!criisProgram) {
    console.error('CRIIS program not found. Creating it...');
    const newProgram = await prisma.program.create({
      data: {
        pgm_cd: 'CRIIS',
        pgm_name: 'Common Remotely Operated Integrated Reconnaissance System',
        pgm_desc: 'Advanced reconnaissance system',
        active: true
      }
    });
    console.log('Created CRIIS program');
  }

  const pgm_id = criisProgram ? criisProgram.pgm_id : 1;

  // Get or create a location
  let location = await prisma.location.findFirst();
  if (!location) {
    location = await prisma.location.create({
      data: {
        display_name: 'Main Warehouse',
        description: 'Main warehouse location for spare parts',
        site_cd: 'WHS-01',
        majcom_cd: 'USAF',
        active: true
      }
    });
  }

  const statuses = ['AVAILABLE', 'ISSUED', 'REPAIR', 'INSPECTION', 'NMC'];
  const partPrefixes = ['SEN', 'CAM', 'PWR', 'COM', 'NAV', 'CPU', 'DSP', 'ANT'];
  const partCategories = ['Sensor', 'Camera', 'Power Supply', 'Communication', 'Navigation', 'Processor', 'Display', 'Antenna'];

  const batchSize = 100;
  const totalRecords = 1000;
  let created = 0;

  for (let batch = 0; batch < totalRecords / batchSize; batch++) {
    const spares = [];

    for (let i = 0; i < batchSize; i++) {
      const index = batch * batchSize + i;
      const prefixIdx = index % partPrefixes.length;
      const partno = `${partPrefixes[prefixIdx]}-${String(index + 1000).padStart(5, '0')}`;
      const serno = `SN${String(index + 50000).padStart(8, '0')}`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Random dates within last 2 years
      const mfgDate = new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000);
      const warrantyExp = new Date(mfgDate.getTime() + (365 + Math.random() * 730) * 24 * 60 * 60 * 1000);

      spares.push({
        pgm_id: pgm_id,
        partno: partno,
        serno: serno,
        status: status,
        loc_id: location.loc_id,
        warranty_exp: warrantyExp,
        mfg_date: mfgDate,
        unit_price: Math.floor(Math.random() * 50000) + 1000,
        remarks: `Test spare part - ${partCategories[prefixIdx]} component`,
        active: true,
        ins_by: 'seed_script'
      });
    }

    // Batch insert
    await prisma.spare.createMany({
      data: spares,
      skipDuplicates: true
    });

    created += batchSize;
    console.log(`Created ${created}/${totalRecords} spare parts...`);
  }

  console.log(`\nSeeding complete! Created ${totalRecords} spare parts.`);

  // Verify count
  const finalCount = await prisma.spare.count();
  console.log(`Total spares in database: ${finalCount}`);

  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  });
