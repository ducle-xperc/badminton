-- Migration: Allow organizers to update tournament participants
-- Fix: Organizers cannot unassign participants from teams because RLS only allows user to update their own registration

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can update their registration" ON tournament_participants;

-- Create new policy: Only organizers can update participants in their tournament
CREATE POLICY "Organizers can update participants" ON tournament_participants
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );
