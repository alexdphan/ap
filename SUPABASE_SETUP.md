# Supabase Setup for Video Comments

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from the settings

## 2. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Database Schema

Run this SQL in your Supabase SQL Editor:

```sql
-- Create comments table
CREATE TABLE comments (
  id BIGSERIAL PRIMARY KEY,
  video_index INTEGER NOT NULL,
  time_seconds REAL NOT NULL,
  text TEXT NOT NULL,
  author TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better performance
CREATE INDEX idx_comments_video_index ON comments(video_index);
CREATE INDEX idx_comments_time ON comments(time_seconds);

-- Enable Row Level Security (RLS)
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read comments
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

-- Allow anyone to insert comments (you can make this more restrictive later)
CREATE POLICY "Anyone can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
```

## 4. Real-time Features

The setup includes:
- ✅ Real-time comments (see new comments as they're added)
- ✅ Comments persist across sessions
- ✅ Comments are shared with all users
- ✅ Automatic sorting by timestamp
- ✅ Video-specific comment filtering

## 5. Optional: Make Comments More Secure

If you want to add authentication later:

```sql
-- Remove the "anyone can insert" policy
DROP POLICY "Anyone can insert comments" ON comments;

-- Add authenticated users only policy
CREATE POLICY "Authenticated users can insert comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## Usage

Once configured, comments will:
- Save automatically to Supabase
- Show up in real-time for all visitors
- Persist between page refreshes
- Be organized by video and timestamp 