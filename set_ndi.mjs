import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setNDIDate() {
  const date = new Date();
  date.setDate(date.getDate() + 5); // 5 days from now

  const asset = await prisma.asset.update({
    where: { asset_id: 907793 },
    data: {
      next_ndi_date: date,
      chg_date: new Date(),
      chg_by: 'test_script'
    }
  });

  console.log('Updated asset:', {
    asset_id: asset.asset_id,
    serno: asset.serno,
    next_ndi_date: asset.next_ndi_date,
    chg_date: asset.chg_date
  });
}

setNDIDate()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
