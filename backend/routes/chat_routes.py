from flask import Blueprint, request, jsonify
from services.chat_service import start_session, handle_message
from utils.helpers import ok, err

chat_bp = Blueprint('chat', __name__)


@chat_bp.route('/chat/start', methods=['POST'])
def chat_start():
    try:
        result = start_session()
        return jsonify(ok(result))
    except Exception as e:
        return jsonify(err(str(e))), 500


@chat_bp.route('/chat/message', methods=['POST'])
def chat_message():
    try:
        body       = request.get_json()
        session_id = body.get('session_id', '')
        message    = body.get('message', '').strip()

        if not message:
            return jsonify(err("Message cannot be empty.")), 400

        result = handle_message(session_id, message)
        return jsonify(ok(result))
    except Exception as e:
        return jsonify(err(str(e))), 500
