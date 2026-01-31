-- Migration: Achievement System
-- Create tables for tournament achievement definitions and user earned achievements

-- 1. Tournament Achievement Tiers (configurable by organizer)
CREATE TABLE tournament_achievement_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,

  -- Position range (inclusive)
  min_position INT NOT NULL,
  max_position INT NOT NULL,

  -- Display info
  title TEXT NOT NULL,
  color TEXT NOT NULL,  -- Hex color code
  icon TEXT,            -- Material icon name
  display_order INT DEFAULT 0,

  -- Constraints
  CONSTRAINT valid_position_range CHECK (min_position > 0 AND max_position >= min_position),
  CONSTRAINT valid_color CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);

-- Indexes
CREATE INDEX idx_achievement_tiers_tournament ON tournament_achievement_tiers(tournament_id);
CREATE UNIQUE INDEX idx_achievement_tiers_unique ON tournament_achievement_tiers(tournament_id, min_position, max_position);

-- 2. User Achievements (earned by users)
CREATE TABLE user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- User and tournament references
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES tournament_achievement_tiers(id) ON DELETE SET NULL,

  -- Achievement details (denormalized for historical preservation)
  title TEXT NOT NULL,
  color TEXT NOT NULL,
  icon TEXT,
  position INT NOT NULL,
  tournament_name TEXT NOT NULL,
  earned_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent duplicate achievements per user per tournament
  UNIQUE(user_id, tournament_id)
);

-- Indexes
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_tournament ON user_achievements(tournament_id);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(user_id, earned_at DESC);

-- 3. RLS Policies for tournament_achievement_tiers
ALTER TABLE tournament_achievement_tiers ENABLE ROW LEVEL SECURITY;

-- Anyone can view tiers
CREATE POLICY "Achievement tiers are viewable by everyone" ON tournament_achievement_tiers
  FOR SELECT USING (true);

-- Only organizer can manage tiers
CREATE POLICY "Organizers can insert achievement tiers" ON tournament_achievement_tiers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can update achievement tiers" ON tournament_achievement_tiers
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can delete achievement tiers" ON tournament_achievement_tiers
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- 4. RLS Policies for user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Anyone can view achievements (for public profiles)
CREATE POLICY "Achievements are viewable by everyone" ON user_achievements
  FOR SELECT USING (true);

-- Only organizer can insert achievements (when ending tournament)
CREATE POLICY "Organizers can insert achievements" ON user_achievements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );
