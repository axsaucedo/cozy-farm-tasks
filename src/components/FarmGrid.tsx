import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FarmItem, StoreItem } from '@/types/game';
import { cropData, storeItems } from '@/data/storeItems';

interface FarmGridProps {
  farmItems: FarmItem[];
  selectedItem: StoreItem | null;
  onPlaceItem: (x: number, y: number) => void;
  onHarvestCrop: (itemId: string) => void;
}

const GRID_SIZE = 6;

export const FarmGrid = ({ farmItems, selectedItem, onPlaceItem, onHarvestCrop }: FarmGridProps) => {
  const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);

  // Create a grid to track occupied spaces
  const occupiedSpaces = new Set(farmItems.map(item => `${item.x}-${item.y}`));

  const handleCellClick = (x: number, y: number) => {
    const isOccupied = occupiedSpaces.has(`${x}-${y}`);
    const existingItem = farmItems.find(item => item.x === x && item.y === y);
    
    if (existingItem && existingItem.stage === 'ready') {
      onHarvestCrop(existingItem.id);
    } else if (!isOccupied && selectedItem) {
      onPlaceItem(x, y);
    }
  };

  const getCellContent = (x: number, y: number) => {
    const item = farmItems.find(item => item.x === x && item.y === y);
    if (!item) return null;

    // Find the store item to get the correct icon
    const storeItem = storeItems.find(storeItem => storeItem.id === item.storeItemId);
    if (!storeItem) return null;

    // For crops, show different stages based on growth
    if (item.storeItemId in cropData) {
      if (item.stage === 'ready') {
        return (
          <div className="text-2xl animate-pulse cursor-pointer" title="Click to harvest!">
            {storeItem.image}
          </div>
        );
      } else if (item.stage === 'growing') {
        return (
          <div className="text-xl">
            🌱
          </div>
        );
      }
    }

    // For decorations and tools, show the store item image
    return <div className="text-2xl">{storeItem.image}</div>;
  };

  const getCellStyle = (x: number, y: number) => {
    const isOccupied = occupiedSpaces.has(`${x}-${y}`);
    const isHovered = hoveredCell?.x === x && hoveredCell?.y === y;
    const item = farmItems.find(item => item.x === x && item.y === y);
    
    let className = "w-full h-16 border-2 border-border rounded-lg flex items-center justify-center transition-all duration-200 ";
    
    if (item?.stage === 'ready') {
      className += "bg-farm-harvest/20 border-farm-harvest hover:bg-farm-harvest/30 cursor-pointer ";
    } else if (isOccupied) {
      className += "bg-farm-grass/20 border-farm-grass ";
    } else if (selectedItem && isHovered) {
      className += "bg-primary/20 border-primary cursor-pointer ";
    } else if (selectedItem) {
      className += "bg-muted hover:bg-primary/10 cursor-pointer ";
    } else {
      className += "bg-farm-earth/10 ";
    }
    
    return className;
  };

  return (
    <Card className="bg-card shadow-farm">
      <CardHeader className="bg-gradient-earth text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          🚜 Your Farm
        </CardTitle>
        {selectedItem && (
          <p className="text-sm opacity-90">
            Click on an empty plot to place your {selectedItem.name}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-6 gap-2 bg-gradient-sky p-4 rounded-lg">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            
            return (
              <div
                key={`${x}-${y}`}
                className={getCellStyle(x, y)}
                onClick={() => handleCellClick(x, y)}
                onMouseEnter={() => setHoveredCell({ x, y })}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {getCellContent(x, y)}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            🌱 Plant crops and watch them grow! Complete tasks to water your plants.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};