-- Migration: Fix team full status trigger for unassign case
-- Bug: When team_id is set to NULL, the comparison OLD.team_id != NEW.team_id returns NULL
-- (not TRUE), so the old team's is_full status was not being updated.

CREATE OR REPLACE FUNCTION update_team_full_status()
RETURNS TRIGGER AS $$
DECLARE
  team_size_val INT;
  member_count INT;
BEGIN
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    IF OLD.team_id IS NOT NULL THEN
      SELECT team_size INTO team_size_val FROM tournaments WHERE id = OLD.tournament_id;
      SELECT COUNT(*) INTO member_count FROM tournament_participants WHERE team_id = OLD.team_id;
      UPDATE tournament_teams SET is_full = (member_count >= team_size_val) WHERE id = OLD.team_id;
    END IF;
    RETURN OLD;
  END IF;

  -- Handle INSERT/UPDATE - update new team if assigned
  IF NEW.team_id IS NOT NULL THEN
    SELECT team_size INTO team_size_val FROM tournaments WHERE id = NEW.tournament_id;
    SELECT COUNT(*) INTO member_count FROM tournament_participants WHERE team_id = NEW.team_id;
    UPDATE tournament_teams SET is_full = (member_count >= team_size_val) WHERE id = NEW.team_id;
  END IF;

  -- Handle UPDATE - also update old team if team was changed or unassigned
  -- Fix: Use IS DISTINCT FROM to properly handle NULL comparison
  IF TG_OP = 'UPDATE' AND OLD.team_id IS NOT NULL AND (OLD.team_id IS DISTINCT FROM NEW.team_id) THEN
    SELECT team_size INTO team_size_val FROM tournaments WHERE id = OLD.tournament_id;
    SELECT COUNT(*) INTO member_count FROM tournament_participants WHERE team_id = OLD.team_id;
    UPDATE tournament_teams SET is_full = (member_count >= team_size_val) WHERE id = OLD.team_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also fix any existing teams that have is_full = true but 0 members
UPDATE tournament_teams tt
SET is_full = false
WHERE is_full = true
  AND NOT EXISTS (
    SELECT 1 FROM tournament_participants tp
    WHERE tp.team_id = tt.id
  );
