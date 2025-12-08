import React, { useState, useEffect } from 'react';
import { Spell, SpellFormData, api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Calendar, 
  Zap, 
  Sword, 
  Edit2, 
  Save, 
  X,
  Trash2
} from 'lucide-react';

interface SpellDetailModalProps {
  spell: Spell | null;
  isOpen: boolean;
  onClose: () => void;
  onSpellUpdate: (updatedSpell: Spell) => void;
  onSpellDelete: (spellId: number) => void;
}

const SpellDetailModal: React.FC<SpellDetailModalProps> = ({
  spell,
  isOpen,
  onClose,
  onSpellUpdate,
  onSpellDelete
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SpellFormData>({
    name: '',
    description: '',
    mana_cost: 0,
    damage: 0,
    element: 'fire'
  });

  const isOwner = spell && user && spell.user_id === user.id;

  useEffect(() => {
    if (spell) {
      setFormData({
        name: spell.name,
        description: spell.description,
        mana_cost: spell.mana_cost,
        damage: spell.damage || 0,
        element: spell.element
      });
      setIsEditing(false);
    }
  }, [spell]);

  const handleInputChange = (field: keyof SpellFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!spell) return;

    setIsLoading(true);
    try {
      const updatedSpell = await api.updateSpell(spell.id, formData);
      onSpellUpdate(updatedSpell);
      setIsEditing(false);
      toast({
        title: "Spell Updated",
        description: "Your spell has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update spell.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!spell || !confirm('Are you sure you want to delete this spell? This action cannot be undone.')) return;

    setIsLoading(true);
    try {
      await api.deleteSpell(spell.id);
      onSpellDelete(spell.id);
      onClose();
      toast({
        title: "Spell Deleted",
        description: "Your spell has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete spell.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSpellTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'fire':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'water':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'earth':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'air':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'dark':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'light':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (!spell) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {isEditing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="text-2xl font-bold bg-transparent border-none p-0 h-auto"
                    placeholder="Spell name"
                  />
                ) : (
                  spell.name
                )}
              </DialogTitle>
              <Badge className={`${getSpellTypeColor(spell.element)}`}>
                {isEditing ? (
                  <Select
                    value={formData.element}
                    onValueChange={(value) => handleInputChange('element', value)}
                  >
                    <SelectTrigger className="w-32 h-6 text-xs bg-transparent border-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fire">Fire</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="earth">Earth</SelectItem>
                      <SelectItem value="air">Air</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  spell.element
                )}
              </Badge>
            </div>
            
            {isOwner && (
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          
          <DialogDescription className="text-base">
            {isEditing ? (
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Spell description"
                className="min-h-[100px] resize-none"
              />
            ) : (
              spell.description
            )}
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <div className="space-y-6">
          {/* Spell Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                Mana Cost
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.mana_cost}
                  onChange={(e) => handleInputChange('mana_cost', parseInt(e.target.value) || 0)}
                  min="0"
                />
              ) : (
                <p className="text-2xl font-bold text-blue-400">{spell.mana_cost}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Sword className="w-4 h-4 text-red-400" />
                Damage
              </Label>
              {isEditing ? (
                <Input
                  type="number"
                  value={formData.damage}
                  onChange={(e) => handleInputChange('damage', parseInt(e.target.value) || 0)}
                  min="0"
                />
              ) : (
                <p className="text-2xl font-bold text-red-400">{spell.damage || 0}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Spell Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Created by User #{spell.user_id}</span>
              {isOwner && <Badge variant="outline" className="text-xs">Your Spell</Badge>}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Spell ID:</span>
              <span>#{spell.id}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Vote Score:</span>
              <span className={spell.vote_count > 0 ? 'text-gold' : spell.vote_count < 0 ? 'text-red-400' : ''}>
                {spell.vote_count}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpellDetailModal;