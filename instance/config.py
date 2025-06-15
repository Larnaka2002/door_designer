# SQLite-файл будет храниться рядом с run.py
SQLALCHEMY_DATABASE_URI = 'sqlite:///door_designer.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = 'dev-key'  # можно позже заменить на .env
