import { useState, useEffect } from 'react';
import { GameState, Task, FarmItem } from '@/types/game';

const INITIAL_GAME_STATE: GameState = {
  points: 100, // Starting points to buy first items
  farmItems: [],
  completedTasks: [],
  farmStats: {
    speed: 1,
    harvestAmount: 1,
    waterEfficiency: 1,
  },
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem('farmTodoGameState');
    return saved ? JSON.parse(saved) : INITIAL_GAME_STATE;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('farmTodoTasks');
    return saved ? JSON.parse(saved).map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
    })) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('farmTodoGameState', JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    localStorage.setItem('farmTodoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addPoints = (points: number) => {
    setGameState(prev => ({ ...prev, points: prev.points + points }));
  };

  const spendPoints = (points: number) => {
    setGameState(prev => ({ ...prev, points: prev.points - points }));
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, completed: true, completedAt: new Date() }
          : t
      ));
      
      addPoints(task.points);
      
      // Water crops that need watering
      waterCrops();
      
      setGameState(prev => ({
        ...prev,
        completedTasks: [...prev.completedTasks, taskId]
      }));
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const addFarmItem = (item: Omit<FarmItem, 'id'>) => {
    const newItem: FarmItem = {
      ...item,
      id: Date.now().toString(),
    };
    setGameState(prev => ({
      ...prev,
      farmItems: [...prev.farmItems, newItem]
    }));
  };

  const waterCrops = () => {
    const now = new Date();
    setGameState(prev => ({
      ...prev,
      farmItems: prev.farmItems.map(item => {
        if (item.stage === 'growing' && item.plantedAt && item.wateringInterval) {
          const hoursSinceWatering = item.lastWatered 
            ? (now.getTime() - item.lastWatered.getTime()) / (1000 * 60 * 60)
            : (now.getTime() - item.plantedAt.getTime()) / (1000 * 60 * 60);
          
          if (hoursSinceWatering >= item.wateringInterval) {
            return { ...item, lastWatered: now };
          }
        }
        return item;
      })
    }));
  };

  const harvestCrop = (itemId: string) => {
    setGameState(prev => ({
      ...prev,
      farmItems: prev.farmItems.map(item =>
        item.id === itemId
          ? { ...item, stage: 'harvested' as const }
          : item
      )
    }));
    
    // Add harvest points (this would be based on crop type)
    addPoints(20);
  };

  return {
    gameState,
    tasks,
    addPoints,
    spendPoints,
    completeTask,
    addTask,
    deleteTask,
    addFarmItem,
    harvestCrop,
  };
};