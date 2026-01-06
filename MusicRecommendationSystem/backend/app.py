from flask import Flask, jsonify, request
from flask_cors import CORS
from models import db, User, Song, Playlist, Feedback
from recommender import get_recommendations
from functools import wraps

app = Flask(__name__, static_folder='static', static_url_path='/static')
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

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # In a real app, we'd check the token/session. 
        # Here we'll expect a simple header or param for simplicity in this dev environment, 
        # OR we'll trust the client to send the user_id and we check the DB.
        # Let's check a header 'X-User-ID' for simplicity 
        user_id = request.headers.get('X-User-ID')
        if not user_id:
             return jsonify({"message": "Unauthorized"}), 401
        
        user = User.query.get(user_id)
        if not user or user.role != 'admin':
            return jsonify({"message": "Forbidden: Admins only"}), 403
        
        return f(*args, **kwargs)
    return decorated_function

@app.route('/songs', methods=['GET', 'POST'])
def handle_songs():
    if request.method == 'POST':
        return add_song()
    return get_songs()

@app.route('/songs/<int:song_id>', methods=['DELETE'])
@admin_required
def delete_song(song_id):
    song = Song.query.get(song_id)
    if not song:
        return jsonify({"message": "Song not found"}), 404
    
    db.session.delete(song)
    db.session.commit()
    return jsonify({"message": "Song deleted successfully"}), 200

def add_song():
    # Admin check manually here if not using decorator on the branching logic 
    # or better, separate the route functions. But let's check auth inside.
    user_id = request.headers.get('X-User-ID')
    if not user_id:
            return jsonify({"message": "Unauthorized"}), 401
    user = User.query.get(user_id)
    if not user or user.role != 'admin':
        return jsonify({"message": "Forbidden"}), 403

    data = request.json
    new_song = Song(
        title=data.get('title'),
        artist=data.get('artist'),
        genre=data.get('genre'),
        mood=data.get('mood'),
        tempo=data.get('tempo'),
        energy=data.get('energy'),
        filename=data.get('filename') # Optional
    )
    db.session.add(new_song)
    db.session.commit()
    return jsonify({"message": "Song added", "id": new_song.id}), 201

@app.route('/songs', methods=['GET'])
def get_songs():
    songs = Song.query.all()
    demo_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    
    # Generate unique artwork for each song based on ID
    def get_artwork_url(song_id, title):
        # Using picsum.photos dictionary for random images
        seed = abs(hash(title)) % 1000
        return f"https://picsum.photos/seed/{seed}/400/400"
    
    return jsonify([{
        "id": s.id, "title": s.title, "artist": s.artist, 
        "genre": s.genre, "mood": s.mood,
        "preview_url": f"http://localhost:5000{s.filename}" if s.filename else demo_url,
        "artwork_url": get_artwork_url(s.id, s.title)
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
    
    def get_artwork_url(song_id, title):
        seed = abs(hash(title)) % 1000
        return f"https://picsum.photos/seed/{seed}/400/400"
    
    return jsonify([{
        "id": s.id, "title": s.title, "artist": s.artist, 
        "genre": s.genre, "mood": s.mood,
        "preview_url": f"http://localhost:5000{s.filename}" if s.filename else demo_url,
        "artwork_url": get_artwork_url(s.id, s.title)
    } for s in results])

@app.route('/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id', type=int)
    song_id = request.args.get('song_id', type=int)
    
    recs = get_recommendations(user_id=user_id, song_id=song_id)
    
    demo_url = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    
    def get_artwork_url(song_id, title):
        # Using picsum.photos for reliable random images
        seed = abs(hash(title)) % 1000
        return f"https://picsum.photos/seed/{seed}/400/400"
    
    return jsonify([{
        "id": s.id, "title": s.title, "artist": s.artist, 
        "genre": s.genre, "mood": s.mood,
        "preview_url": f"http://localhost:5000{s.filename}" if s.filename else demo_url,
        "artwork_url": get_artwork_url(s.id, s.title)
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
        role=data.get('role', 'user'),
        preferences=data.get('preferences', '{}')
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        # print(f"Login attempt for: {data.get('username')}")
        user = User.query.filter_by(username=data.get('username')).first()
        
        if user and user.password == data.get('password'):
            return jsonify({
                "message": "Login successful", 
                "user_id": user.id, 
                "username": user.username,
                "role": user.role,
                "preferences": user.preferences
            })
        return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        print(f"Error in login: {e}")
        return jsonify({"message": "Server error"}), 500

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user_profile(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({
        "username": user.username,
        "role": user.role,
        "preferences": user.preferences
    })



@app.route('/feedback', methods=['POST'])
def submit_feedback():
    data = request.json
    new_feedback = Feedback(
        name=data.get('name'),
        rating=data.get('rating'),
        message=data.get('message')
    )
    db.session.add(new_feedback)
    db.session.commit()
    return jsonify({"message": "Feedback submitted"}), 201

@app.route('/feedback', methods=['GET'])
@admin_required
def get_feedback():
    feedbacks = Feedback.query.order_by(Feedback.created_at.desc()).all()
    return jsonify([{
        "id": f.id,
        "name": f.name,
        "rating": f.rating,
        "message": f.message,
        "created_at": f.created_at.isoformat()
    } for f in feedbacks])

if __name__ == '__main__':
    with app.app_context():
        import os
        if not os.path.exists('music.db'):
            import seed_data
            seed_data.seed()
    app.run(debug=True, port=5000)

