import React, { useState } from 'react';
import { Spell } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, User, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import SpellDetailModal from './SpellDetailModal';

interface SpellCardProps {
  spell: Spell;
  onVoteUpdate: (spellId: number, newVoteCount: number, userVote: 'upvote' | 'downvote' | null) => void;
  onSpellUpdate: (updatedSpell: Spell) => void;
  onSpellDelete: (spellId: number) => void;
}

const SpellCard: React.FC<SpellCardProps> = ({ spell, onVoteUpdate, onSpellUpdate, onSpellDelete }) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { user } = useAuth(); // Pega o usuário do contexto de autenticação
  const isOwner = user?.id === spell.user_id;

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (!isAuthenticated || isVoting) return;
    console.log(`Spell ${spell.id}: count=${spell.vote_count}, user_vote=${spell.user_vote}`);

    setIsVoting(true);
    try {
      // 1. Chama a API. A 'response' agora é o objeto Spell completo e atualizado
      const updatedSpell = await api.voteSpell(spell.id, voteType);
      
      // 2. Usa a resposta direta do back-end para atualizar o estado
      onVoteUpdate(updatedSpell.id, updatedSpell.vote_count, updatedSpell.user_vote);
      
      toast({
        title: "Vote Updated!",
        description: "Your preference has been recorded.",
      });

    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        toast({
          title: "Action Forbidden",
          description: "You cannot vote on your own spell.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "An error occurred",
          description: "Could not cast your vote. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsVoting(false);
    }
  };

  const getSpellTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'attack':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'defense':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'utility':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'healing':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'illusion':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <>
    <Card className="bg-gradient-card border-border/50 shadow-card hover:shadow-magical transition-all duration-300 group cursor-pointer">
      <CardHeader className="pb-3" onClick={() => setIsDetailModalOpen(true)}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-gold transition-colors">
              {spell.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`text-xs ${getSpellTypeColor(spell.element)}`}>
                {spell.element}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDetailModalOpen(true);
                }}
              >
                <Eye className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
            {/* Vote Section */}
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
            <Button
              variant="ghost"
              size="sm"
              // MUDANÇA: Agora também é desabilitado se o usuário for o dono
              disabled={isOwner || isVoting || !isAuthenticated}
              onClick={(e) => {
              e.stopPropagation();
              handleVote('upvote');
              }}
              // MUDANÇA: A classe muda de cor se o usuário deu upvote e adiciona classes de dono
              className={`h-8 w-8 p-0 transition-all duration-200 ${isOwner ? 'opacity-30 cursor-not-allowed' : ''} ${spell.user_vote === 'upvote' ? 'text-amber-500 hover:text-amber-600' : ''}`}
            >
              <ChevronUp className="w-4 h-4" />
            </Button>

            <span
              className={`text-sm font-semibold ${
              spell.vote_count > 0
                ? 'text-gold'
                : spell.vote_count < 0
                ? 'text-red-400'
                : 'text-muted-foreground'
              }`}
            >
              {spell.vote_count}
            </span>

            <Button
              variant="ghost"
              size="sm"
              // MUDANÇA: Agora também é desabilitado se o usuário for o dono
              disabled={isOwner || isVoting || !isAuthenticated}
              onClick={(e) => {
              e.stopPropagation();
              handleVote('downvote');
              }}
              // MUDANÇA: A classe muda de cor se o usuário deu downvote e adiciona classes de dono
              className={`h-8 w-8 p-0 transition-all duration-200 ${isOwner ? 'opacity-30 cursor-not-allowed' : ''} ${spell.user_vote === 'downvote' ? 'text-blue-500 hover:text-blue-600' : ''}`}
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
            </div>
        </div>
      </CardHeader>
      
      <CardContent onClick={() => setIsDetailModalOpen(true)}>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {spell.description}
        </CardDescription>
        
        <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          <span>Spell #{spell.id}</span>
        </div>
      </CardContent>
    </Card>

    <SpellDetailModal
      spell={spell}
      isOpen={isDetailModalOpen}
      onClose={() => setIsDetailModalOpen(false)}
      onSpellUpdate={onSpellUpdate}
      onSpellDelete={onSpellDelete}
    />
    </>
  );
};

export default SpellCard;