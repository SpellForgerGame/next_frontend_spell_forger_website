'use client';

import SpellCard from '@/components/SpellCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Spell } from '@/services/api';
import { Clock, Filter, Flame, Search, Sparkles, TrendingUp, User } from 'lucide-react';
import { useEffect, useState } from 'react';


function Spells({ initialSpells = [] }: Readonly<{ initialSpells: Spell[] }>) {
  const [spells, setSpells] = useState<Spell[]>(initialSpells || []);
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [elementFilter, setelementFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showMySpells, setShowMySpells] = useState(false);
  const { user } = useAuth();



  // Filter and sort spells when dependencies change
  useEffect(() => {
    let filtered = [...spells];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(spell =>
        spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        spell.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (elementFilter !== 'all') {
      filtered = filtered.filter(spell =>
        spell.element.toLowerCase() === elementFilter.toLowerCase()
      );
    }

    // Apply my spells filter
    if (showMySpells && user) {
      filtered = filtered.filter(spell => spell.user_id === user.id);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => b.id - a.id); // Sort by ID since no created_at field
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id); // Sort by ID since no created_at field
        break;
      case 'most_voted':
        filtered.sort((a, b) => b.vote_count - a.vote_count);
        break;
      case 'least_voted':
        filtered.sort((a, b) => a.vote_count - b.vote_count);
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    setFilteredSpells(filtered);
  }, [spells, searchTerm, elementFilter, sortBy, showMySpells, user]);



  const handleVoteUpdate = (spellId: number, newVoteCount: number, userVote: 'upvote' | 'downvote' | null) => {
    setSpells(prevSpells =>
      prevSpells.map(spell =>
        spell.id === spellId
          ? { ...spell, vote_count: newVoteCount, user_vote: userVote }
          : spell
      )
    );
  };

  const handleSpellUpdate = (updatedSpell: Spell) => {
    setSpells(prevSpells =>
      prevSpells.map(spell =>
        spell.id === updatedSpell.id ? updatedSpell : spell
      )
    );
  };

  const handleSpellDelete = (spellId: number) => {
    setSpells(prevSpells => prevSpells.filter(spell => spell.id !== spellId));
  };

  const getUniqueSpellTypes = () => {
    const types = spells.map(spell => spell.element);
    return [...new Set(types)];
  };

  const getSortIcon = () => {
    switch (sortBy) {
      case 'most_voted':
        return <TrendingUp className="w-4 h-4" />;
      case 'newest':
        return <Clock className="w-4 h-4" />;
      case 'oldest':
        return <Clock className="w-4 h-4" />;
      default:
        return <Filter className="w-4 h-4" />;
    }
  };

  /*
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="p-3 bg-gradient-primary rounded-full shadow-magical animate-magical-glow">
                  <Sparkles className="w-6 h-6 text-primary-foreground animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Loading Spells...
              </h2>
              <p className="text-muted-foreground">
                Gathering magical knowledge from the archives
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }*/

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        {
          JSON.stringify(initialSpells)
        }
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-magical">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Spell Grimoire</h1>
              <p className="text-muted-foreground">
                Discover and vote on magical spells from the community
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search spells..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter by Element */}
            <Select value={elementFilter} onValueChange={setelementFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4" />
                  <SelectValue placeholder="Filter by element" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Elements</SelectItem>
                {getUniqueSpellTypes().map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <div className="flex items-center gap-2">
                  {getSortIcon()}
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="most_voted">Most Voted</SelectItem>
                <SelectItem value="least_voted">Least Voted</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>

            {/* My Spells Toggle */}
            {user && (
              <Button
                variant={showMySpells ? "default" : "outline"}
                onClick={() => setShowMySpells(!showMySpells)}
                className="shrink-0"
              >
                <User className="w-4 h-4 mr-2" />
                My Spells
              </Button>
            )}

            {/* Refresh
            <Button
              variant="outline"
              size="icon"
              onClick={fetchSpells}
              disabled={isLoading}
              className="shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button> */}
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSpells.length} of {spells.length} spells
          </p>
        </div>

        {/* Spells Grid */}
        {filteredSpells.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No spells found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || elementFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to submit a spell to the grimoire!'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSpells.map((spell) => (
              <SpellCard
                key={spell.id}
                spell={spell}
                onVoteUpdate={handleVoteUpdate}
                onSpellUpdate={handleSpellUpdate}
                onSpellDelete={handleSpellDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/*
async function fetchSpells(): Promise<Spell[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not set');
  }
  const formData = new URLSearchParams();
  formData.append('username', env.USER_NAME!);
  formData.append('password', env.USER_PASSWORD!);

  const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const loginResponse = await apiClient.post('/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  const response = await apiClient.get('/spells',
    {
      headers: {
        Authorization: `Bearer ${loginResponse.data.access_token}`
      }
    }
  );
 
  if (!response.status.toString().startsWith('2')) {
    throw new Error('Failed to fetch spells');
  }

  return response.data;
}


export const revalidate = 30;

export async function getStaticProps() {
  const res = await fetchSpells();

  return {
    props: {
      spells: res,
    },
    revalidate: revalidate,
  }
}
*/
export default Spells;