from app.extensions import db

class Insert(db.Model):
    __tablename__ = "inserts"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(30), nullable=False)  # glass / wood / panel / profile
    thickness = db.Column(db.Float, nullable=False)
    gap = db.Column(db.Float, default=0)
    color = db.Column(db.String(50), default='clear')
