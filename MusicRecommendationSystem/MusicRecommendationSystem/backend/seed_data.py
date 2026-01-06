from app import app, db
from models import Song, User

def seed():
    with app.app_context():
        db.create_all()
        
        if Song.query.first():
            print("Database already seeded.")
            return

        # Sample Data
        songs = [
            Song(title="Shape of You", artist="Ed Sheeran", genre="Pop", mood="Happy", tempo=96.0, energy=0.8),
            Song(title="Blinding Lights", artist="The Weeknd", genre="Synth-Pop", mood="Energetic", tempo=171.0, energy=0.9),
            Song(title="Someone Like You", artist="Adele", genre="Soul", mood="Sad", tempo=67.0, energy=0.4),
            Song(title="Bohemian Rhapsody", artist="Queen", genre="Rock", mood="Dramatic", tempo=72.0, energy=0.7),
            Song(title="Levitating", artist="Dua Lipa", genre="Pop", mood="Dance", tempo=103.0, energy=0.8),
            Song(title="Numb", artist="Linkin Park", genre="Rock", mood="Angry", tempo=110.0, energy=0.9),
            Song(title="Uptown Funk", artist="Mark Ronson", genre="Funk", mood="Happy", tempo=115.0, energy=0.9),
            Song(title="Hotel California", artist="Eagles", genre="Rock", mood="Chill", tempo=74.0, energy=0.6),
            Song(title="Bad Guy", artist="Billie Eilish", genre="Pop", mood="Dark", tempo=135.0, energy=0.5),
            Song(title="Thinking Out Loud", artist="Ed Sheeran", genre="Pop", mood="Romantic", tempo=79.0, energy=0.6),
        ]

        db.session.add_all(songs)
        
        # Test User
        admin = User(username="admin", password="password", preferences='{"genres": ["Pop", "Rock"]}')
        db.session.add(admin)

        db.session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
