from flask import Blueprint, request, jsonify
from models.antifragile import log_feedback, get_stats
from utils.helpers import ok, err

feedback_bp = Blueprint('feedback', __name__)

@feedback_bp.route('/feedback', methods=['POST'])
def submit_feedback():
    try:
        body             = request.get_json()
        symptoms         = body.get('symptoms', [])
        predicted        = body.get('predicted_disease', '')
        correct          = body.get('correct', True)
        actual           = body.get('actual_disease', None)

        result = log_feedback(symptoms, predicted, correct, actual)
        return jsonify(ok(result))
    except Exception as e:
        return jsonify(err(str(e))), 500


@feedback_bp.route('/feedback/stats', methods=['GET'])
def feedback_stats():
    try:
        return jsonify(ok(get_stats()))
    except Exception as e:
        return jsonify(err(str(e))), 500
