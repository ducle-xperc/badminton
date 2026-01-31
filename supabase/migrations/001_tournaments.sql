-- Create tournaments table
CREATE TABLE tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Basic info
  name TEXT NOT NULL,
  description TEXT,
  banner_url TEXT,

  -- Schedule
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  registration_deadline DATE,

  -- Location
  location TEXT NOT NULL,

  -- Settings
  max_participants INT DEFAULT 32,
  current_participants INT DEFAULT 0,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  prize_pool TEXT,

  -- Status: upcoming, ongoing, completed, cancelled
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),

  -- Organizer
  organizer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Categories (e.g., Men's Singles, Women's Doubles)
  categories JSONB DEFAULT '[]'
);

-- Enable Row Level Security
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Anyone can view tournaments
CREATE POLICY "Tournaments are viewable by everyone" ON tournaments
  FOR SELECT USING (true);

-- Only authenticated users can create tournaments
CREATE POLICY "Authenticated users can create tournaments" ON tournaments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only organizer can update their tournaments
CREATE POLICY "Organizers can update their tournaments" ON tournaments
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Only organizer can delete their tournaments
CREATE POLICY "Organizers can delete their tournaments" ON tournaments
  FOR DELETE USING (auth.uid() = organizer_id);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tournaments
CREATE TRIGGER tournaments_updated_at
  BEFORE UPDATE ON tournaments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create index for common queries
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_start_date ON tournaments(start_date);
CREATE INDEX idx_tournaments_organizer_id ON tournaments(organizer_id);
