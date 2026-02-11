// Servicio de datos local - funciona sin backend
import { Settings, Raffle, Order, Winner, AdminUser } from '../types';

// Datos hardcodeados de plantilla (solo se usan si el backend no responde)
const HARDCODED_SETTINGS: Settings = {
  id: 'main_settings',
  siteName: 'LA BOVEDA VIP',
  paymentAccounts: [],
  faqs: [],
  collaborationVideoUrl: '',
  collaborations: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Sin rifas hardcodeadas - siempre debe usar el backend
const HARDCODED_RAFFLES: Raffle[] = [];

const HARDCODED_ORDERS: Order[] = [];

const HARDCODED_WINNERS: Winner[] = [];

const HARDCODED_USERS: AdminUser[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@luckysnap.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

// Simular delay de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const localApi = {
  // Settings
  async getSettings(): Promise<Settings> {
    await delay(500); // Simular delay de red
    return HARDCODED_SETTINGS;
  },

  async updateSettings(settings: Partial<Settings>): Promise<Settings> {
    await delay(500);
    const updated = { ...HARDCODED_SETTINGS, ...settings, updatedAt: new Date() };
    Object.assign(HARDCODED_SETTINGS, updated);
    return updated;
  },

  // Raffles
  async getRaffles(): Promise<Raffle[]> {
    await delay(500);
    return HARDCODED_RAFFLES;
  },

  async createRaffle(raffle: Omit<Raffle, 'id' | 'createdAt' | 'updatedAt'>): Promise<Raffle> {
    await delay(500);
    const newRaffle: Raffle = {
      ...raffle,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    HARDCODED_RAFFLES.push(newRaffle);
    return newRaffle;
  },

  async updateRaffle(id: string, updates: Partial<Raffle>): Promise<Raffle> {
    await delay(500);
    const index = HARDCODED_RAFFLES.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Raffle not found');
    
    HARDCODED_RAFFLES[index] = { ...HARDCODED_RAFFLES[index], ...updates, updatedAt: new Date() };
    return HARDCODED_RAFFLES[index];
  },

  async deleteRaffle(id: string): Promise<void> {
    await delay(500);
    const index = HARDCODED_RAFFLES.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Raffle not found');
    HARDCODED_RAFFLES.splice(index, 1);
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    await delay(500);
    return HARDCODED_ORDERS;
  },

  async createOrder(orderData: Omit<Order, 'folio' | 'status' | 'createdAt' | 'expiresAt' | 'id'>): Promise<Order> {
    await delay(500);
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      folio: `ORD-${Date.now()}`,
      status: 'PENDING',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas
    };
    HARDCODED_ORDERS.push(newOrder);
    return newOrder;
  },

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    await delay(500);
    const index = HARDCODED_ORDERS.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    
    HARDCODED_ORDERS[index] = { ...HARDCODED_ORDERS[index], ...updates, updatedAt: new Date() };
    return HARDCODED_ORDERS[index];
  },

  async deleteOrder(id: string): Promise<void> {
    await delay(500);
    const index = HARDCODED_ORDERS.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Order not found');
    HARDCODED_ORDERS.splice(index, 1);
  },

  async getOrderByFolio(folio: string): Promise<Order | undefined> {
    await delay(500);
    return HARDCODED_ORDERS.find(o => o.folio === folio);
  },

  // Customers (alias para órdenes pagadas)
  async getCustomers(): Promise<Order[]> {
    await delay(500);
    return HARDCODED_ORDERS.filter(o => o.status === 'PAID');
  },

  async getCustomerById(id: string): Promise<Order | undefined> {
    await delay(500);
    return HARDCODED_ORDERS.find(o => o.id === id && o.status === 'PAID');
  },

  // Winners
  async getWinners(): Promise<Winner[]> {
    await delay(500);
    return HARDCODED_WINNERS;
  },

  // Users
  async getUsers(): Promise<AdminUser[]> {
    await delay(500);
    return HARDCODED_USERS;
  },

  async createUser(userData: Omit<AdminUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<AdminUser> {
    await delay(500);
    const newUser: AdminUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    HARDCODED_USERS.push(newUser);
    return newUser;
  },

  // Dashboard stats
  async getDashboardStats() {
    await delay(500);
    return {
      totalRaffles: HARDCODED_RAFFLES.length,
      activeRaffles: HARDCODED_RAFFLES.filter(r => r.status === 'active').length,
      totalOrders: HARDCODED_ORDERS.length,
      totalRevenue: HARDCODED_ORDERS.reduce((sum, order) => sum + (order.total || 0), 0),
      totalWinners: HARDCODED_WINNERS.length,
    };
  }
};
