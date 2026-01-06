from app import app, db
from models import Song, User
import json
import os

def seed():
    with app.app_context():
        db.create_all()
        
        if Song.query.first():
            print("Database already seeded.")
            return

        # Load metadata from JSON file
        metadata_file = os.path.join(os.path.dirname(__file__), 'songs_metadata.json')
        
        if os.path.exists(metadata_file):
            with open(metadata_file, 'r', encoding='utf-8') as f:
                songs_data = json.load(f)
            
            songs = []
            for song_data in songs_data:
                song = Song(
                    title=song_data['title'],
                    artist=song_data['artist'],
                    genre=song_data['genre'],
                    mood=song_data['mood'],
                    tempo=song_data.get('tempo', 120.0),
                    energy=song_data.get('energy', 0.7),
                    filename=f"/static/songs/{song_data['filename']}"
                )
                songs.append(song)
            
            db.session.add_all(songs)
            print(f"Added {len(songs)} songs from metadata file")
        else:
            print("Warning: songs_metadata.json not found, using sample data")
            # Fallback to sample data
            songs = [
                Song(title="Shape of You", artist="Ed Sheeran", genre="Pop", mood="Happy", tempo=96.0, energy=0.8),
                Song(title="Blinding Lights", artist="The Weeknd", genre="Synth-Pop", mood="Energetic", tempo=171.0, energy=0.9),
            ]
            db.session.add_all(songs)
        
        # Test User
        admin = User(username="admin", password="password", role="admin", preferences='{"genres": ["Pop", "Rock"]}')
        db.session.add(admin)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
