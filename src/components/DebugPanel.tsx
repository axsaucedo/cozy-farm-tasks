import { useState } from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, Bug, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

export const DebugPanel = () => {
  const { flags, toggleFlag, resetFlags } = useDebug();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-50">
      <Card className="w-80 shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bug className="h-4 w-4 text-destructive" />
              <CardTitle className="text-sm">Debug Panel</CardTitle>
              <Badge variant="outline" className="text-xs">DEV</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFlags}
                className="h-6 w-6 p-0"
                title="Reset all flags"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="h-6 w-6 p-0"
              >
                {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
            </div>
          </div>
          <CardDescription className="text-xs">
            Global debug flags for testing and development
          </CardDescription>
        </CardHeader>

        {isOpen && (
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">Fast Watering</div>
                  <div className="text-xs text-muted-foreground">
                    Change watering time from hours to minutes
                  </div>
                </div>
                <Switch
                  checked={flags.fastWatering}
                  onCheckedChange={() => toggleFlag('fastWatering')}
                />
              </div>

              <Separator />

              <div className="text-xs text-muted-foreground">
                <div className="flex items-center gap-1 mb-1">
                  <Settings className="h-3 w-3" />
                  <span className="font-medium">Active Flags:</span>
                </div>
                {Object.entries(flags).filter(([_, value]) => value).length === 0 ? (
                  <span className="text-muted-foreground/70">None</span>
                ) : (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(flags)
                      .filter(([_, value]) => value)
                      .map(([key]) => (
                        <Badge key={key} variant="secondary" className="text-xs">
                          {key}
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};