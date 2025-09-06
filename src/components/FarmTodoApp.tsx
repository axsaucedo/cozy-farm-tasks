import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { TaskManager } from '@/components/TaskManager';
import { FarmStore } from '@/components/FarmStore';
import { FarmGrid } from '@/components/FarmGrid';
import { DebugPanel } from '@/components/DebugPanel';
import { StoreItem } from '@/types/game';
import { storeItems, cropData } from '@/data/storeItems';
import { toast } from '@/hooks/use-toast';
import farmHero from '@/assets/farm-hero.jpg';

export const FarmTodoApp = () => {
  const {
    gameState,
    tasks,
    addPoints,
    spendPoints,
    completeTask,
    addTask,
    deleteTask,
    addFarmItem,
    harvestCrop,
  } = useGameState();

  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

  const handlePurchase = (item: StoreItem) => {
    if (gameState.points >= item.price) {
      spendPoints(item.price);
      setSelectedItem(item);
      toast({
        title: "Item purchased!",
        description: `You bought ${item.name}. Click on your farm to place it.`,
      });
    } else {
      toast({
        title: "Not enough points!",
        description: `You need ${item.price - gameState.points} more points to buy this item.`,
        variant: "destructive",
      });
    }
  };

  const handlePlaceItem = (x: number, y: number) => {
    if (!selectedItem) return;

    const newFarmItem = {
      storeItemId: selectedItem.id,
      x,
      y,
      stage: selectedItem.type === 'crop' ? 'growing' as const : 'planted' as const,
      plantedAt: selectedItem.type === 'crop' ? new Date() : undefined,
      wateringInterval: selectedItem.type === 'crop' && selectedItem.id in cropData 
        ? cropData[selectedItem.id as keyof typeof cropData].wateringInterval 
        : undefined,
    };

    addFarmItem(newFarmItem);
    setSelectedItem(null);
    
    toast({
      title: "Item placed!",
      description: selectedItem.type === 'crop' 
        ? `Your ${selectedItem.name} is now growing. Complete tasks to water it!`
        : `${selectedItem.name} has been added to your farm.`,
    });
  };

  const handleHarvestCrop = (itemId: string) => {
    const item = gameState.farmItems.find(i => i.id === itemId);
    if (item && item.storeItemId in cropData) {
      const crop = cropData[item.storeItemId as keyof typeof cropData];
      addPoints(crop.harvestValue);
      harvestCrop(itemId);
      
      toast({
        title: "Crop harvested!",
        description: `You earned ${crop.harvestValue} points from your harvest!`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <DebugPanel />
      {/* Hero Section */}
      <div 
        className="relative h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${farmHero})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-farm-earth/80 to-transparent"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2">🌾 Farm Todo</h1>
            <p className="text-xl opacity-90">Turn your tasks into a thriving farm!</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Tasks */}
          <div className="space-y-6">
            <TaskManager
              tasks={tasks}
              points={gameState.points}
              onCompleteTask={completeTask}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
            />
            
            <FarmStore
              points={gameState.points}
              onPurchase={handlePurchase}
            />
          </div>

          {/* Right Column - Farm */}
          <div>
            <FarmGrid
              farmItems={gameState.farmItems}
              selectedItem={selectedItem}
              onPlaceItem={handlePlaceItem}
              onHarvestCrop={handleHarvestCrop}
            />
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-card rounded-lg p-6 shadow-farm">
          <h3 className="text-lg font-semibold mb-4 text-farm-earth">🌟 How to Play</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2">📝 Complete Tasks</h4>
              <p>Add and complete tasks to earn points. Each completed task also waters your crops!</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🛒 Buy & Plant</h4>
              <p>Use points to buy seeds, tools, and decorations. Plant crops and watch them grow!</p>
            </div>
            <div className="bg-secondary p-4 rounded-lg">
              <h4 className="font-semibold mb-2">🌾 Harvest & Sell</h4>
              <p>When crops are ready (they'll glow!), click to harvest and earn even more points!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};