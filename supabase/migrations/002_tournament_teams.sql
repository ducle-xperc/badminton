-- Migration: Tournament Teams and Participants
-- Add team_size to tournaments, create teams and participants tables

-- 1. Add team_size column to tournaments table
ALTER TABLE tournaments ADD COLUMN IF NOT EXISTS team_size INT DEFAULT 2 CHECK (team_size IN (1, 2));

-- 2. Create tournament_teams table
CREATE TABLE tournament_teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_number INT NOT NULL,
  is_full BOOLEAN DEFAULT false,
  UNIQUE(tournament_id, team_number)
);

-- Indexes for tournament_teams
CREATE INDEX idx_tournament_teams_tournament ON tournament_teams(tournament_id);
CREATE INDEX idx_tournament_teams_available ON tournament_teams(tournament_id, is_full) WHERE is_full = false;

-- Updated_at trigger for tournament_teams
CREATE TRIGGER tournament_teams_updated_at
  BEFORE UPDATE ON tournament_teams
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Create tournament_participants table
CREATE TABLE tournament_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES tournament_teams(id) ON DELETE SET NULL,
  team_number INT,
  UNIQUE(tournament_id, user_id)
);

-- Indexes for tournament_participants
CREATE INDEX idx_tournament_participants_tournament ON tournament_participants(tournament_id);
CREATE INDEX idx_tournament_participants_user ON tournament_participants(user_id);
CREATE INDEX idx_tournament_participants_team ON tournament_participants(team_id);

-- 4. Function to auto-create teams when tournament is created or max_participants/team_size updated
CREATE OR REPLACE FUNCTION create_tournament_teams()
RETURNS TRIGGER AS $$
DECLARE
  num_teams INT;
  i INT;
BEGIN
  -- Calculate number of teams
  num_teams := NEW.max_participants / COALESCE(NEW.team_size, 2);

  -- Delete existing teams if updating (only if no participants assigned)
  IF TG_OP = 'UPDATE' THEN
    -- Only recreate teams if no participants have been assigned yet
    IF NOT EXISTS (
      SELECT 1 FROM tournament_participants
      WHERE tournament_id = NEW.id AND team_id IS NOT NULL
    ) THEN
      DELETE FROM tournament_teams WHERE tournament_id = NEW.id;
    ELSE
      -- If participants exist, don't recreate teams
      RETURN NEW;
    END IF;
  END IF;

  -- Create teams
  FOR i IN 1..num_teams LOOP
    INSERT INTO tournament_teams (tournament_id, team_number)
    VALUES (NEW.id, i)
    ON CONFLICT (tournament_id, team_number) DO NOTHING;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create teams on tournament insert or update of max_participants/team_size
CREATE TRIGGER tournament_create_teams
  AFTER INSERT OR UPDATE OF max_participants, team_size ON tournaments
  FOR EACH ROW EXECUTE FUNCTION create_tournament_teams();

-- 5. Function to update team is_full status when participant is assigned
CREATE OR REPLACE FUNCTION update_team_full_status()
RETURNS TRIGGER AS $$
DECLARE
  team_size_val INT;
  member_count INT;
BEGIN
  -- Handle both INSERT/UPDATE and DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.team_id IS NOT NULL THEN
      -- Get team size from tournament
      SELECT team_size INTO team_size_val FROM tournaments WHERE id = OLD.tournament_id;
      -- Count current members
      SELECT COUNT(*) INTO member_count FROM tournament_participants WHERE team_id = OLD.team_id;
      -- Update is_full
      UPDATE tournament_teams SET is_full = (member_count >= team_size_val) WHERE id = OLD.team_id;
    END IF;
    RETURN OLD;
  ELSE
    IF NEW.team_id IS NOT NULL THEN
      -- Get team size from tournament
      SELECT team_size INTO team_size_val FROM tournaments WHERE id = NEW.tournament_id;
      -- Count current members
      SELECT COUNT(*) INTO member_count FROM tournament_participants WHERE team_id = NEW.team_id;
      -- Update is_full
      UPDATE tournament_teams SET is_full = (member_count >= team_size_val) WHERE id = NEW.team_id;
    END IF;

    -- If team was changed, also update old team
    IF TG_OP = 'UPDATE' AND OLD.team_id IS NOT NULL AND OLD.team_id != NEW.team_id THEN
      SELECT team_size INTO team_size_val FROM tournaments WHERE id = OLD.tournament_id;
      SELECT COUNT(*) INTO member_count FROM tournament_participants WHERE team_id = OLD.team_id;
      UPDATE tournament_teams SET is_full = (member_count >= team_size_val) WHERE id = OLD.team_id;
    END IF;

    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update team status
CREATE TRIGGER participant_update_team_status
  AFTER INSERT OR UPDATE OF team_id OR DELETE ON tournament_participants
  FOR EACH ROW EXECUTE FUNCTION update_team_full_status();

-- 6. Function to update tournament current_participants count
CREATE OR REPLACE FUNCTION update_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE tournaments SET current_participants = current_participants + 1 WHERE id = NEW.tournament_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE tournaments SET current_participants = current_participants - 1 WHERE id = OLD.tournament_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update participant count
CREATE TRIGGER participant_count_trigger
  AFTER INSERT OR DELETE ON tournament_participants
  FOR EACH ROW EXECUTE FUNCTION update_participant_count();

-- 7. RLS Policies for tournament_teams
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;

-- Anyone can view teams
CREATE POLICY "Teams are viewable by everyone" ON tournament_teams
  FOR SELECT USING (true);

-- Organizers can insert teams (for manual team creation if needed)
CREATE POLICY "Organizers can insert teams" ON tournament_teams
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Organizers can update teams
CREATE POLICY "Organizers can update teams" ON tournament_teams
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- Organizers can delete teams
CREATE POLICY "Organizers can delete teams" ON tournament_teams
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- 8. RLS Policies for tournament_participants
ALTER TABLE tournament_participants ENABLE ROW LEVEL SECURITY;

-- Anyone can view participants
CREATE POLICY "Participants are viewable by everyone" ON tournament_participants
  FOR SELECT USING (true);

-- Authenticated users can register themselves
CREATE POLICY "Users can register themselves" ON tournament_participants
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND auth.uid() IS NOT NULL
  );

-- Users can update their own registration (for team assignment during draw)
CREATE POLICY "Users can update their registration" ON tournament_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- Users or organizers can delete registration
CREATE POLICY "Users or organizers can delete registration" ON tournament_participants
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );

-- 9. Create teams for existing tournaments
DO $$
DECLARE
  t RECORD;
  num_teams INT;
  i INT;
BEGIN
  FOR t IN SELECT id, max_participants, team_size FROM tournaments LOOP
    num_teams := t.max_participants / COALESCE(t.team_size, 2);
    FOR i IN 1..num_teams LOOP
      INSERT INTO tournament_teams (tournament_id, team_number)
      VALUES (t.id, i)
      ON CONFLICT (tournament_id, team_number) DO NOTHING;
    END LOOP;
  END LOOP;
END $$;
