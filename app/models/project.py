from app.extensions import db

class DoorProject(db.Model):
    __tablename__ = "door_projects"

    id = db.Column(db.Integer, primary_key=True)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
