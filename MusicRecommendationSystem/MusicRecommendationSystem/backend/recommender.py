import random
from models import Song, Rating

def get_recommendations(user_id=None, song_id=None, limit=5):
    """
    Get music recommendations.
    1. If song_id is provided, recommend similar songs (Content-Based on item).
    2. If user_id is provided, recommend based on user's high ratings (Content-Based on profile).
    3. Fallback to random songs.
    """
    all_songs = Song.query.all()
    if not all_songs:
        return []

    # 1. Item-based (Similar to a specific song)
    if song_id:
        target_song = Song.query.get(song_id)
        if target_song:
            # Recommend same genre
            similar_songs = [s for s in all_songs if s.genre == target_song.genre and s.id != target_song.id]
            if similar_songs:
                return random.sample(similar_songs, min(len(similar_songs), limit))

    # 2. User-based (Based on what they liked)
    if user_id:
        # Get songs user rated 4 or 5
        high_ratings = Rating.query.filter(Rating.user_id == user_id, Rating.rating >= 4).all()
        
        if high_ratings:
            liked_song_ids = [r.song_id for r in high_ratings]
            liked_songs = Song.query.filter(Song.id.in_(liked_song_ids)).all()
            
            # Find favorite genres
            liked_genres = set(s.genre for s in liked_songs)
            
            # Recommend songs in those genres, excluding ones already rated
            recommendations = [
                s for s in all_songs 
                if s.genre in liked_genres and s.id not in liked_song_ids
            ]
            
            if recommendations:
                random.shuffle(recommendations)
                return recommendations[:limit]

    # 3. Fallback: Random selection
    return random.sample(all_songs, min(len(all_songs), limit))
