import { StoreItem } from '@/types/game';

export const storeItems: StoreItem[] = [
  // Crops
  {
    id: 'carrot',
    name: 'Carrot Seeds',
    type: 'crop',
    price: 15,
    description: 'Fast-growing carrots. Ready in 2 hours with watering every hour.',
    image: '🥕',
  },
  {
    id: 'tomato',
    name: 'Tomato Seeds',
    type: 'crop',
    price: 25,
    description: 'Juicy tomatoes. Ready in 4 hours with watering every 2 hours.',
    image: '🍅',
  },
  {
    id: 'wheat',
    name: 'Wheat Seeds',
    type: 'crop',
    price: 40,
    description: 'Golden wheat. Ready in 6 hours with watering every 3 hours.',
    image: '🌾',
  },
  
  // Tools
  {
    id: 'basic-hoe',
    name: 'Basic Hoe',
    type: 'tool',
    price: 100,
    description: 'Increases planting speed by 50%.',
    image: '🔨',
    stats: { speed: 1.5 },
  },
  {
    id: 'water-can',
    name: 'Watering Can',
    type: 'tool',
    price: 150,
    description: 'Improves water efficiency, crops need less frequent watering.',
    image: '🪣',
    stats: { waterEfficiency: 1.5 },
  },
  {
    id: 'harvest-basket',
    name: 'Harvest Basket',
    type: 'tool',
    price: 200,
    description: 'Increases harvest amount by 50%.',
    image: '🧺',
    stats: { harvestAmount: 1.5 },
  },
  
  // Decorations
  {
    id: 'scarecrow',
    name: 'Scarecrow',
    type: 'decoration',
    price: 75,
    description: 'A friendly scarecrow to watch over your crops.',
    image: '🎃',
  },
  {
    id: 'flower-bed',
    name: 'Flower Bed',
    type: 'decoration',
    price: 60,
    description: 'Beautiful flowers to brighten up your farm.',
    image: '🌸',
  },
  {
    id: 'fence',
    name: 'Wooden Fence',
    type: 'decoration',
    price: 30,
    description: 'Classic wooden fence for your farm boundaries.',
    image: '🪵',
  },
];

export const cropData = {
  carrot: {
    growthTime: 2,
    wateringInterval: 1,
    harvestValue: 25,
    stages: ['🌱', '🥕'],
  },
  tomato: {
    growthTime: 4,
    wateringInterval: 2,
    harvestValue: 40,
    stages: ['🌱', '🌿', '🍅'],
  },
  wheat: {
    growthTime: 6,
    wateringInterval: 3,
    harvestValue: 60,
    stages: ['🌱', '🌿', '🌾'],
  },
};