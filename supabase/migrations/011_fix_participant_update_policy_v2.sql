-- Migration: Fix participant update policy to allow both users and organizers
-- Fix: Migration 010 only allowed organizers, breaking the draw feature for regular users

-- Drop the policy from migration 010
DROP POLICY IF EXISTS "Organizers can update participants" ON tournament_participants;

-- Create new policy that allows:
-- 1. Users to update their own registration (for draw)
-- 2. Organizers to update any participant in their tournament (for assign/unassign)
CREATE POLICY "Users or organizers can update participants" ON tournament_participants
  FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );
