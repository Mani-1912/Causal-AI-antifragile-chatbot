from flask import Flask
from flask_cors import CORS
from routes.chat_routes import chat_bp
from routes.disease_routes import disease_bp
from routes.feedback_routes import feedback_bp
import config

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"])

app.register_blueprint(chat_bp,     url_prefix='/api')
app.register_blueprint(disease_bp,  url_prefix='/api')
app.register_blueprint(feedback_bp, url_prefix='/api')

@app.route('/api/health', methods=['GET'])
def health_check():
    return {"status": "ok", "message": "Arogya Backend is running! 🌿"}

if __name__ == '__main__':
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
