export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  points: number;
  createdAt: Date;
  completedAt?: Date;
  recurring?: {
    type: 'daily' | 'weekly' | 'custom';
    interval?: number; // for custom recurring tasks
  };
}

export interface StoreItem {
  id: string;
  name: string;
  type: 'crop' | 'tool' | 'decoration';
  price: number;
  description: string;
  image: string;
  stats?: {
    [key: string]: number; // for tools (speed, harvest amount, etc.)
  };
}

export interface FarmItem {
  id: string;
  storeItemId: string;
  x: number;
  y: number;
  plantedAt?: Date;
  lastWatered?: Date;
  wateringInterval?: number; // hours between watering
  readyToHarvest?: boolean;
  stage: 'planted' | 'growing' | 'ready' | 'harvested';
}

export interface GameState {
  points: number;
  farmItems: FarmItem[];
  completedTasks: string[];
  farmStats: {
    speed: number;
    harvestAmount: number;
    waterEfficiency: number;
  };
}

export interface CropData {
  growthTime: number; // hours
  wateringInterval: number; // hours
  harvestValue: number; // points gained when sold
  stages: string[]; // visual stages of growth
}