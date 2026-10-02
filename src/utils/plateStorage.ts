import { PlateOrder } from '../types/plate';

const STORAGE_KEY = 'wizconnect_plate_orders_v1';

export const INITIAL_PLATES: PlateOrder[] = [
  {
    id: 'plate-000001',
    serialNumber: '000001',
    businessName: 'Barbearia & Lounge Dom Juan',
    category: 'Salão & Barbearia',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phoneWhatsapp: '+55 11 98765-4321',
    contactEmail: 'contato@domjuanbarber.com.br',
    instagram: '@domjuanbarber',
    topCustomText: 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE',
    status: 'active',
    style: 'google_classic',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plate-000002',
    serialNumber: '000002',
    businessName: 'Café & Bistrô Aromas do Grão',
    category: 'Restaurante / Café',
    googleReviewUrl: 'https://g.page/r/CWizConnectDemo/review',
    phoneWhatsapp: '+55 21 99887-1122',
    contactEmail: 'gerencia@aromasdograo.com.br',
    instagram: '@aromasdograo',
    topCustomText: 'AVALIE SUA EXPERIÊNCIA NO GOOGLE',
    status: 'pending_setup',
    style: 'google_classic',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'plate-000003',
    serialNumber: '000003',
    businessName: 'Clínica Odonto Prime Especialidades',
    category: 'Saúde & Odontologia',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJo982348uDmsRUsoyG83frY4',
    phoneWhatsapp: '+55 31 97654-3210',
    topCustomText: 'SUA OPINIÃO VALE MUITO NO GOOGLE',
    status: 'active',
    style: 'google_classic',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getStoredPlates = (): PlateOrder[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PLATES));
      return INITIAL_PLATES;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load plates from localStorage', e);
    return INITIAL_PLATES;
  }
};

export const savePlateOrder = (order: Omit<PlateOrder, 'id' | 'createdAt' | 'updatedAt'>): PlateOrder => {
  const plates = getStoredPlates();
  const existingIndex = plates.findIndex(p => p.serialNumber === order.serialNumber);

  const now = new Date().toISOString();
  let updatedOrder: PlateOrder;

  if (existingIndex >= 0) {
    updatedOrder = {
      ...plates[existingIndex],
      ...order,
      updatedAt: now,
    };
    plates[existingIndex] = updatedOrder;
  } else {
    updatedOrder = {
      ...order,
      id: `plate-${order.serialNumber || Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    plates.unshift(updatedOrder);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(plates));
  return updatedOrder;
};

export const findPlateBySerial = (serial: string): PlateOrder | undefined => {
  const plates = getStoredPlates();
  return plates.find(p => p.serialNumber.toLowerCase() === serial.toLowerCase());
};

export const generateNextSerial = (): string => {
  const plates = getStoredPlates();
  if (plates.length === 0) return '000001';
  
  const numbers = plates
    .map(p => parseInt(p.serialNumber, 10))
    .filter(n => !isNaN(n));
  
  const max = numbers.length > 0 ? Math.max(...numbers) : 0;
  return String(max + 1).padStart(6, '0');
};
