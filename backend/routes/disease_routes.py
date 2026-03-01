from flask import Blueprint, request, jsonify
from services.disease_service import get_disease_info, list_all_diseases
from services.location_service import find_hospitals
from utils.helpers import ok, err

disease_bp = Blueprint('disease', __name__)


@disease_bp.route('/disease/info', methods=['GET'])
def disease_info():
    try:
        disease = request.args.get('disease', '').strip()
        if not disease:
            return jsonify(err("Disease name is required.")), 400
        result = get_disease_info(disease)
        return jsonify(ok(result))
    except Exception as e:
        return jsonify(err(str(e))), 500


@disease_bp.route('/disease/list', methods=['GET'])
def disease_list():
    try:
        return jsonify(ok({"diseases": list_all_diseases()}))
    except Exception as e:
        return jsonify(err(str(e))), 500


@disease_bp.route('/hospitals/search', methods=['GET'])
def hospitals_search():
    try:
        lat      = request.args.get('lat')
        lon      = request.args.get('lon')
        city     = request.args.get('location', '').strip()
        disease  = request.args.get('disease', '')

        if lat and lon:
            hospitals = find_hospitals(lat=float(lat), lon=float(lon))
        elif city:
            hospitals = find_hospitals(city=city)
        else:
            return jsonify(err("Provide lat/lon or location (city name).")), 400

        return jsonify(ok({"hospitals": hospitals, "disease": disease, "count": len(hospitals)}))
    except Exception as e:
        return jsonify(err(str(e))), 500
