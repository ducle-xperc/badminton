-- Allow organizers to delete achievements for their tournaments
CREATE POLICY "Organizers can delete achievements" ON user_achievements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM tournaments t
      WHERE t.id = tournament_id
      AND t.organizer_id = auth.uid()
    )
  );
