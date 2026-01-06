from app import app, db
from models import User

with app.app_context():
    admin = User.query.filter_by(username='admin').first()
    if admin:
        admin.role = 'admin'
        db.session.commit()
        print("Admin user updated with role='admin'")
    else:
        print("Admin user not found, creating...")
        admin = User(username="admin", password="password", role="admin", preferences='{"genres": ["Pop", "Rock"]}')
        db.session.add(admin)
        db.session.commit()
        print("Admin user created")
