const generateSKU = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
  let sku = '';
  for (let i = 0; i < 8; i++) {
    sku += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `SKU-${sku}`;
};

module.exports = generateSKU;
