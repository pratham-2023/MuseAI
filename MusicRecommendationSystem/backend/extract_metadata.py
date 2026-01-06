import os
import json
from mutagen.mp3 import MP3
from mutagen.id3 import ID3

def extract_metadata():
    """Extract metadata from all MP3 files in static/songs directory"""
    songs_dir = os.path.join(os.path.dirname(__file__), 'static', 'songs')
    songs_data = []
    
    if not os.path.exists(songs_dir):
        print(f"Error: Directory {songs_dir} does not exist")
        return []
    
    mp3_files = [f for f in os.listdir(songs_dir) if f.endswith('.mp3')]
    print(f"Found {len(mp3_files)} MP3 files")
    
    for filename in mp3_files:
        filepath = os.path.join(songs_dir, filename)
        
        try:
            audio = MP3(filepath, ID3=ID3)
            
            # Extract metadata
            title = filename.replace('.mp3', '')  # Default to filename
            artist = "Unknown Artist"
            genre = "Unknown"
            album = ""
            
            # Try to get ID3 tags
            if audio.tags:
                title = str(audio.tags.get('TIT2', title))
                artist = str(audio.tags.get('TPE1', artist))
                genre_tag = audio.tags.get('TCON', None)
                if genre_tag:
                    genre = str(genre_tag)
                album_tag = audio.tags.get('TALB', None)
                if album_tag:
                    album = str(album_tag)
            
            # Calculate tempo and energy (simplified)
            duration = audio.info.length
            bitrate = audio.info.bitrate
            
            # Assign mood based on genre (simplified mapping)
            mood_map = {
                'pop': 'Happy',
                'rock': 'Energetic',
                'hip hop': 'Energetic',
                'rap': 'Energetic',
                'electronic': 'Dance',
                'dance': 'Dance',
                'r&b': 'Chill',
                'soul': 'Romantic',
                'jazz': 'Chill',
                'classical': 'Calm',
                'country': 'Happy',
                'indie': 'Chill'
            }
            
            mood = "Happy"  # Default
            for key, value in mood_map.items():
                if key in genre.lower():
                    mood = value
                    break
            
            song_data = {
                'filename': filename,
                'title': title,
                'artist': artist,
                'genre': genre,
                'mood': mood,
                'tempo': 120.0,  # Default tempo
                'energy': 0.7,   # Default energy
                'duration': duration,
                'album': album
            }
            
            songs_data.append(song_data)
            print(f"✓ {title} - {artist}")
            
        except Exception as e:
            print(f"✗ Error processing {filename}: {e}")
            # Add with minimal data
            songs_data.append({
                'filename': filename,
                'title': filename.replace('.mp3', ''),
                'artist': 'Unknown Artist',
                'genre': 'Unknown',
                'mood': 'Happy',
                'tempo': 120.0,
                'energy': 0.7
            })
    
    # Save to JSON file
    output_file = os.path.join(os.path.dirname(__file__), 'songs_metadata.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(songs_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Metadata saved to {output_file}")
    print(f"Total songs processed: {len(songs_data)}")
    
    return songs_data

if __name__ == "__main__":
    extract_metadata()
