import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Sparkles, Wand2, Shield, Wrench, Heart, Eye, Zap } from 'lucide-react';

const Submit: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    mana_cost: 0,
    damage: 0,
    element: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const navigate = useNavigate();
  const { toast } = useToast();

  const spellTypes = [
    { value: 'Attack', label: 'Attack', icon: Zap, description: 'Offensive magical spells' },
    { value: 'Defense', label: 'Defense', icon: Shield, description: 'Protective and defensive magic' },
    { value: 'Utility', label: 'Utility', icon: Wrench, description: 'Practical everyday magic' },
    { value: 'Healing', label: 'Healing', icon: Heart, description: 'Restorative and curative spells' },
    { value: 'Illusion', label: 'Illusion', icon: Eye, description: 'Deceptive and mind-affecting magic' },
    { value: 'Enchantment', label: 'Enchantment', icon: Sparkles, description: 'Enhancement and augmentation spells' },
  ];

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Spell name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Spell name must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Spell description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.element) {
      newErrors.element = 'Spell type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.createSpell({
        ...formData,
        element: formData.element // Map 'element' to required 'type'
      });
      
      toast({
        title: "Spell Created Successfully!",
        description: `"${formData.name}" has been added to the grimoire.`,
      });
      
      navigate('/spells');
    } catch (error: any) {
      toast({
        title: "Failed to Create Spell",
        description: error.response?.data?.message || "Could not create spell. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleTypeChange = (value: string) => {
    setFormData(prev => ({ ...prev, element: value }));
    if (errors.element) {
      setErrors(prev => ({ ...prev, element: '' }));
    }
  };

  const selectedTypeInfo = spellTypes.find(type => type.value === formData.element);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="p-3 bg-gradient-primary rounded-full shadow-magical animate-float">
              <Wand2 className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Forge a New Spell
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your magical knowledge with the community and contribute to our growing spell database
          </p>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Create New Spell
              </CardTitle>
              <CardDescription>
                Provide detailed information about your spell to help others understand its power and purpose
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Spell Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Spell Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`bg-background/50 ${errors.name ? 'border-destructive' : ''}`}
                    placeholder="Enter the name of your spell (e.g., Fireball, Shield of Light)"
                    required
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                {/* Spell Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Spell Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`bg-background/50 min-h-[120px] resize-none ${errors.description ? 'border-destructive' : ''}`}
                    placeholder="Describe your spell in detail. Include its effects, casting requirements, duration, range, and any special conditions. Be as descriptive as possible to help others understand how the spell works."
                    required
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formData.description.length} characters</span>
                    <span>Minimum 20 characters required</span>
                  </div>
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>
                
                {/* Mana Cost */}
                <div className="space-y-2">
                  <Label htmlFor="mana_cost">Mana Cost *</Label>
                  <Input
                    id="mana_cost"
                    name="mana_cost"
                    type="number"
                    value={formData.mana_cost}
                    onChange={handleInputChange}
                    className={`bg-background/50 ${errors.mana_cost ? 'border-destructive' : ''}`}
                    placeholder="e.g., 50"
                    required
                  />
                  {errors.mana_cost && (
                    <p className="text-sm text-destructive">{errors.mana_cost}</p>
                  )}
                </div>

                {/* Spell Damage */}
                <div className="space-y-2">
                  <Label htmlFor="damage">Spell Damage *</Label>
                  <Input
                    id="damage"
                    name="damage"
                    type="number"
                    value={formData.damage}
                    onChange={handleInputChange}
                    className={`bg-background/50 ${errors.damage ? 'border-destructive' : ''}`}
                    placeholder="e.g., 75"
                    required
                  />
                  {errors.damage && (
                    <p className="text-sm text-destructive">{errors.damage}</p>
                  )}
                </div>

                {/* CAMPO 'TYPE' AJUSTADO PARA 'ELEMENT' */}
                <div className="space-y-2">
                  <Label htmlFor="element">Spell Type *</Label>
                  <Select 
                    value={formData.element} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, element: value }))}
                  >
                    <SelectTrigger className={`bg-background/50 ${errors.element ? 'border-destructive' : ''}`}>
                      <SelectValue placeholder="Choose the type of the spell" />
                    </SelectTrigger>
                    <SelectContent>
                      {spellTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.element && (
                    <p className="text-sm text-destructive">{errors.element}</p>
                  )}
                </div>

                {/* Guidelines */}
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-gold" />
                    Spell Creation Guidelines
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Be creative but maintain internal consistency</li>
                    <li>• Include casting requirements (components, gestures, incantations)</li>
                    <li>• Specify duration, range, and area of effect</li>
                    <li>• Consider balance - powerful spells should have limitations</li>
                    <li>• Use vivid descriptions to help visualize the spell's effects</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/spells')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 shadow-gold hover:animate-magical-glow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                        Creating Spell...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        Forge Spell
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Submit;