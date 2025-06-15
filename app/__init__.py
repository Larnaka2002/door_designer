from flask import Flask
from app.extensions import db, migrate

def create_app():
    app = Flask(__name__)
    app.config.from_pyfile('../instance/config.py')

    db.init_app(app)
    migrate.init_app(app, db)

    # блюпринт импортируем внутри функции (это ключевой момент!)
    from app.routes.door import door_bp
    app.register_blueprint(door_bp, url_prefix="/door")

    return app
