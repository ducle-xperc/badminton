-- Migration: Tournament Matches (Double Elimination)
-- Create matches table and rankings table for tournament bracket system

-- 1. Create tournament_matches table
CREATE TABLE tournament_matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,

  -- Bracket information (double elimination)
  bracket TEXT NOT NULL CHECK (bracket IN ('winners', 'losers', 'grand_final')),

  -- Round information
  round INT NOT NULL, -- Round number within the bracket (1, 2, 3, etc.)
  match_number INT NOT NULL, -- Match number within the round

  -- Teams (nullable for future matches where teams TBD)
  team1_number INT,
  team2_number INT,

  -- Scores (null until match is played)
  team1_score INT,
  team2_score INT,

  -- Winner (set when match completes)
  winner_team_number INT,

  -- Scheduling
  scheduled_at TIMESTAMPTZ,
  court TEXT,

  -- Status
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed')),

  -- Is this a reset match in grand final (when LB champ beats WB champ)
  is_reset_match BOOLEAN DEFAULT FALSE,

  -- Constraint: match unique per tournament per bracket per round
  UNIQUE(tournament_id, bracket, round, match_number, is_reset_match)
);

-- Indexes for tournament_matches
CREATE INDEX idx_matches_tournament ON tournament_matches(tournament_id);
CREATE INDEX idx_matches_status ON tournament_matches(tournament_id, status);
CREATE INDEX idx_matches_bracket ON tournament_matches(tournament_id, bracket);
CREATE INDEX idx_matches_round ON tournament_matches(tournament_id, bracket, round);

-- Updated_at trigger for tournament_matches
CREATE TRIGGER tournament_matches_updated_at
  BEFORE UPDATE ON tournament_matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 2. Create tournament_rankings table for final standings
CREATE TABLE tournament_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_number INT NOT NULL,
  position INT NOT NULL,
  points INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,

  UNIQUE(tournament_id, team_number)
);

-- Index for tournament_rankings
CREATE INDEX idx_rankings_tournament ON tournament_rankings(tournament_id);
CREATE INDEX idx_rankings_position ON tournament_rankings(tournament_id, position);

-- 3. Add current_round tracking to tournaments table
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS current_wb_round INT DEFAULT NULL;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS current_lb_round INT DEFAULT NULL;
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS bracket_generated BOOLEAN DEFAULT FALSE;

-- 4. RLS Policies for tournament_matches
ALTER TABLE tournament_matches ENABLE ROW LEVEL SECURITY;

-- Anyone can view matches
CREATE POLICY "Matches are viewable by everyone" ON tournament_matches
  FOR SELECT USING (true);

-- Only organizer can insert matches
CREATE POLICY "Organizers can insert matches" ON tournament_matches
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Only organizer can update matches
CREATE POLICY "Organizers can update matches" ON tournament_matches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Only organizer can delete matches
CREATE POLICY "Organizers can delete matches" ON tournament_matches
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- 5. RLS Policies for tournament_rankings
ALTER TABLE tournament_rankings ENABLE ROW LEVEL SECURITY;

-- Anyone can view rankings
CREATE POLICY "Rankings are viewable by everyone" ON tournament_rankings
  FOR SELECT USING (true);

-- Only organizer can modify rankings
CREATE POLICY "Organizers can insert rankings" ON tournament_rankings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update rankings" ON tournament_rankings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can delete rankings" ON tournament_rankings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );
