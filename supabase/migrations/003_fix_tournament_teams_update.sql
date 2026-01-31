-- Migration: Fix tournament teams update logic
-- Allow adding/removing teams when max_participants or team_size changes

-- Drop and recreate the function with improved logic
CREATE OR REPLACE FUNCTION create_tournament_teams()
RETURNS TRIGGER AS $$
DECLARE
  num_teams INT;
  current_max_team INT;
  i INT;
BEGIN
  -- Calculate number of teams needed
  num_teams := NEW.max_participants / COALESCE(NEW.team_size, 2);

  IF TG_OP = 'UPDATE' THEN
    -- Get current max team number
    SELECT COALESCE(MAX(team_number), 0) INTO current_max_team
    FROM tournament_teams WHERE tournament_id = NEW.id;

    IF num_teams > current_max_team THEN
      -- Need more teams: add new teams from current_max+1 to num_teams
      FOR i IN (current_max_team + 1)..num_teams LOOP
        INSERT INTO tournament_teams (tournament_id, team_number)
        VALUES (NEW.id, i)
        ON CONFLICT (tournament_id, team_number) DO NOTHING;
      END LOOP;
    ELSIF num_teams < current_max_team THEN
      -- Need fewer teams: delete empty teams with team_number > num_teams
      DELETE FROM tournament_teams
      WHERE tournament_id = NEW.id
        AND team_number > num_teams
        AND id NOT IN (
          SELECT DISTINCT team_id FROM tournament_participants
          WHERE tournament_id = NEW.id AND team_id IS NOT NULL
        );
    END IF;
  ELSE
    -- INSERT: create all teams
    FOR i IN 1..num_teams LOOP
      INSERT INTO tournament_teams (tournament_id, team_number)
      VALUES (NEW.id, i)
      ON CONFLICT (tournament_id, team_number) DO NOTHING;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
