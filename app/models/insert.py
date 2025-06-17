from app.extensions import db

class Insert(db.Model):
    __tablename__ = "inserts"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(30), nullable=False)  # glass / wood / panel / profile
    thickness = db.Column(db.Float, nullable=False)
    color = db.Column(db.String(50), default='clear')

    # Новые поля
    mount_type = db.Column(db.String(20), default='in_slot')  # 'in_slot' или 'outside'
    gap = db.Column(db.Float, default=0.0)  # зазор по периметру
    direction = db.Column(db.String(20), default='vertical')  # 'vertical' или 'horizontal'
