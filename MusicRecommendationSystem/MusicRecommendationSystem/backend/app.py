from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Song
from recommender import get_recommendations

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///music.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)
db.init_app(app)

@app.route('/seed')
def seed_db():
    # Helper to seed via browser if needed
    import seed_data
    seed_data.seed()
    return jsonify({"message": "Database seeded"})

@app.route('/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    # Using a copyright-free placeholder URL for demo purposes
    # This is a short loop or sample
    demo_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    
    return jsonify([{
        "id": s.id, "title": s.title, "artist": s.artist, 
        "genre": s.genre, "mood": s.mood,
        "preview_url": s.filename if s.filename else demo_url
    } for s in songs])

@app.route('/search', methods=['GET'])
def search_songs():
    query = request.args.get('q', '').lower()
    if not query:
        return jsonify([])
    
    # Simple case-insensitive search
    results = Song.query.filter(
        (Song.title.ilike(f'%{query}%')) | 
        (Song.artist.ilike(f'%{query}%')) |
        (Song.genre.ilike(f'%{query}%'))
    ).all()
    
    demo_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    return jsonify([{
        "id": s.id, "title": s.title, "artist": s.artist, 
        "genre": s.genre, "mood": s.mood,
        "preview_url": s.filename if s.filename else demo_url
    } for s in results])

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id', type=int)
    song_id = request.args.get('song_id', type=int)
    
    recs = get_recommendations(user_id=user_id, song_id=song_id)
    
    demo_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    return jsonify([{
        "id": s.id, "title": s.title, "artist": s.artist, 
        "genre": s.genre, "mood": s.mood,
        "preview_url": s.filename if s.filename else demo_url
    } for s in recs])

    return jsonify([{
        "id": s.id, "title": s.title, "artist": s.artist, 
        "genre": s.genre, "mood": s.mood
    } for s in results])

@app.route('/rate', methods=['POST'])
def rate_song():
    data = request.json
    user_id = data.get('user_id')
    song_id = data.get('song_id')
    rating_val = data.get('rating')

    if not all([user_id, song_id, rating_val]):
        return jsonify({"message": "Missing data"}), 400

    from models import Rating
    # Check if rating exists
    existing = Rating.query.filter_by(user_id=user_id, song_id=song_id).first()
    if existing:
        existing.rating = rating_val
    else:
        new_rating = Rating(user_id=user_id, song_id=song_id, rating=rating_val)
        db.session.add(new_rating)
    
    db.session.commit()
    return jsonify({"message": "Rating submitted"}), 200

    db.session.commit()
    return jsonify({"message": "Rating submitted"}), 200

# Playlist Routes
@app.route('/playlists', methods=['GET', 'POST'])
def handle_playlists():
    if request.method == 'POST':
        data = request.json
        new_playlist = Playlist(
            name=data.get('name'),
            user_id=data.get('user_id'),
            songs=''
        )
        db.session.add(new_playlist)
        db.session.commit()
        return jsonify({"message": "Playlist created", "id": new_playlist.id}), 201
    
    # GET
    user_id = request.args.get('user_id')
    playlists = Playlist.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": p.id, "name": p.name, "song_count": len(p.songs.split(',')) if p.songs else 0
    } for p in playlists])

@app.route('/playlists/<int:playlist_id>', methods=['GET'])
def get_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({"message": "Playlist not found"}), 404
        
    # Get song details
    song_ids = [int(id) for id in playlist.songs.split(',') if id]
    songs = Song.query.filter(Song.id.in_(song_ids)).all()
    
    return jsonify({
        "id": playlist.id, "name": playlist.name,
        "songs": [{
            "id": s.id, "title": s.title, "artist": s.artist, 
            "genre": s.genre, "mood": s.mood
        } for s in songs]
    })

@app.route('/playlists/<int:playlist_id>/add', methods=['POST'])
def add_to_playlist(playlist_id):
    data = request.json
    song_id = str(data.get('song_id'))
    
    playlist = Playlist.query.get(playlist_id)
    if not playlist:
        return jsonify({"message": "Playlist not found"}), 404
        
    current_songs = playlist.songs.split(',') if playlist.songs else []
    if song_id not in current_songs:
        current_songs.append(song_id)
        playlist.songs = ",".join(current_songs)
        db.session.commit()
        
    return jsonify({"message": "Song added to playlist"}), 200

# Simple Auth
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({"message": "Username already exists"}), 400
    
    new_user = User(
        username=data.get('username'),
        password=data.get('password'), # In prod, hash this!
        preferences=data.get('preferences', '{}')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.password == data.get('password'):
        return jsonify({
            "message": "Login successful", 
            "user_id": user.id, 
            "username": user.username,
            "preferences": user.preferences
        })
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "username": user.username,
        "preferences": user.preferences
    })

if __name__ == '__main__':
    with app.app_context():
        import os
        if not os.path.exists('music.db'):
            import seed_data
            seed_data.seed()
    app.run(debug=True, port=5000)
