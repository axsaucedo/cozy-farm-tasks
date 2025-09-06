import { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { storeItems } from '@/data/storeItems';
import { StoreItem } from '@/types/game';

interface FarmStoreProps {
  points: number;
  onPurchase: (item: StoreItem) => void;
}

export const FarmStore = ({ points, onPurchase }: FarmStoreProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'crop' | 'tool' | 'decoration'>('crop');

  const crops = storeItems.filter(item => item.type === 'crop');
  const tools = storeItems.filter(item => item.type === 'tool');
  const decorations = storeItems.filter(item => item.type === 'decoration');

  const canAfford = (price: number) => points >= price;

  const handlePurchase = (item: StoreItem) => {
    if (canAfford(item.price)) {
      onPurchase(item);
    }
  };

  const StoreItemCard = ({ item }: { item: StoreItem }) => (
    <Card className="bg-card hover:shadow-glow transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="text-center">
          <div className="text-4xl mb-2">{item.image}</div>
          <CardTitle className="text-lg">{item.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground text-center">{item.description}</p>
        
        {item.stats && (
          <div className="space-y-1">
            <p className="text-xs font-semibold text-farm-earth">Effects:</p>
            {Object.entries(item.stats).map(([stat, value]) => (
              <Badge key={stat} variant="secondary" className="text-xs">
                {stat}: +{Math.round((value - 1) * 100)}%
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-farm-sun fill-current" />
            <span className="font-semibold">{item.price}</span>
          </div>
          <Button
            size="sm"
            onClick={() => handlePurchase(item)}
            disabled={!canAfford(item.price)}
            className={canAfford(item.price) ? "bg-farm-grass hover:bg-farm-grass/80" : ""}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {canAfford(item.price) ? 'Buy' : 'Too Expensive'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Card className="bg-card shadow-farm">
      <CardHeader className="bg-gradient-farm text-primary-foreground rounded-t-lg">
        <CardTitle className="flex items-center gap-2">
          🏪 Farm Store
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="crop">🌱 Crops</TabsTrigger>
            <TabsTrigger value="tool">🔨 Tools</TabsTrigger>
            <TabsTrigger value="decoration">🎨 Decor</TabsTrigger>
          </TabsList>
          
          <TabsContent value="crop" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crops.map((item) => (
                <StoreItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="tool" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tools.map((item) => (
                <StoreItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="decoration" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decorations.map((item) => (
                <StoreItemCard key={item.id} item={item} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};