from app.extensions import db

class Profile(db.Model):
    __tablename__ = "profiles"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # vertical / horizontal
    width = db.Column(db.Float, nullable=False)
    thickness = db.Column(db.Float, nullable=False)
    groove_depth = db.Column(db.Float, default=0)
    allowance = db.Column(db.Float, default=0)
    color = db.Column(db.String(50), default='gray')
    stock_length = db.Column(db.Float, default=2800)
    # Глубина паза (например, 10 мм)
    groove_depth = db.Column(db.Float, default=10.0)

    # Ширина паза (например, 10 мм)
    groove_width = db.Column(db.Float, default=10.0)

    # Сторона, куда направлен паз (по умолчанию внутрь полотна)
    groove_side = db.Column(db.String(20), default='inner')  # варианты: 'inner', 'outer', 'both'

