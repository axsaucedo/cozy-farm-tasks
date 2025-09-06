import { useState } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Task } from '@/types/game';

interface TaskManagerProps {
  tasks: Task[];
  points: number;
  onCompleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskManager = ({ tasks, points, onCompleteTask, onAddTask, onDeleteTask }: TaskManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    points: 10,
  });

  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      onAddTask(newTask);
      setNewTask({ title: '', description: '', points: 10 });
      setIsDialogOpen(false);
    }
  };

  return (
    <Card className="bg-card shadow-farm">
      <CardHeader className="bg-gradient-farm text-primary-foreground rounded-t-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            📝 Tasks & Chores
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="bg-farm-sun text-farm-sun-foreground px-3 py-1 rounded-full text-sm font-semibold">
              🌟 {points} points
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      value={newTask.title}
                      onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="What needs to be done?"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      value={newTask.description}
                      onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Any additional details..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="points">Points Reward</Label>
                    <Input
                      id="points"
                      type="number"
                      value={newTask.points}
                      onChange={(e) => setNewTask(prev => ({ ...prev, points: parseInt(e.target.value) || 10 }))}
                      min="1"
                      max="100"
                    />
                  </div>
                  <Button onClick={handleAddTask} className="w-full">
                    Add Task
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 p-4">
        {activeTasks.length === 0 && completedTasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks yet! Add your first task to start farming. 🌱</p>
          </div>
        )}
        
        {activeTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-farm-earth">Active Tasks</h3>
            {activeTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-secondary rounded-lg">
                <Button
                  size="sm"
                  onClick={() => onCompleteTask(task.id)}
                  className="bg-farm-grass hover:bg-farm-grass/80"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  )}
                </div>
                <div className="text-farm-sun font-semibold">+{task.points}</div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDeleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {completedTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-farm-earth">Recently Completed</h3>
            {completedTasks.slice(-3).map((task) => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg opacity-75">
                <div className="w-8 h-8 bg-farm-grass rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium line-through">{task.title}</p>
                </div>
                <div className="text-farm-sun font-semibold">+{task.points}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};