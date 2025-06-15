from app import create_app

app = create_app()

if __name__ == "__main__":
    print(app.url_map)  # покажет зарегистрированные маршруты
    app.run(port=7040, debug=True)
