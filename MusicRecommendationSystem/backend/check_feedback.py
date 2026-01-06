from app import app, db, Feedback

with app.app_context():
    feedbacks = Feedback.query.all()
    print(f"Total Feedback Count: {len(feedbacks)}")
    for f in feedbacks:
        print(f"ID: {f.id}, Name: {f.name}, Message: {f.message}")
