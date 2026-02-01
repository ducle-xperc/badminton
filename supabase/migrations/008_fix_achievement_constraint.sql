-- Migration: Fix achievement constraint to allow multiple achievements per tournament
-- This enables users to receive multiple achievement tiers for the same tournament
-- (e.g., Champion, Top 3, and Participant all at once if position qualifies)

-- Drop old constraint that only allowed 1 achievement per user per tournament
ALTER TABLE user_achievements DROP CONSTRAINT IF EXISTS user_achievements_user_id_tournament_id_key;

-- Add new constraint allowing multiple achievements per tournament (one per tier)
ALTER TABLE user_achievements ADD CONSTRAINT user_achievements_user_tier_unique
  UNIQUE(user_id, tournament_id, tier_id);
