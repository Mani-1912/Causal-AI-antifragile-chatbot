import requests, math


def _geocode_city(city: str) -> tuple:
    url  = "https://nominatim.openstreetmap.org/search"
    resp = requests.get(url, params={"q": city, "format": "json", "limit": 1},
                        headers={"User-Agent": "Arogya-Health-App/1.0"}, timeout=10)
    resp.raise_for_status()
    results = resp.json()
    if not results:
        raise ValueError(f"City '{city}' not found.")
    return float(results[0]["lat"]), float(results[0]["lon"])


def _haversine(lat1, lon1, lat2, lon2) -> float:
    R  = 6371
    d1 = math.radians(lat2 - lat1)
    d2 = math.radians(lon2 - lon1)
    a  = (math.sin(d1/2)**2 +
          math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(d2/2)**2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def find_hospitals(lat: float = None, lon: float = None,
                   city: str = None, radius_m: int = 5000) -> list:
    if city:
        lat, lon = _geocode_city(city)
    if lat is None or lon is None:
        raise ValueError("Provide either lat/lon or city name.")

    query = f"""[out:json][timeout:25];
(
  node["amenity"="hospital"](around:{radius_m},{lat},{lon});
  node["amenity"="clinic"](around:{radius_m},{lat},{lon});
  node["amenity"="doctors"](around:{radius_m},{lat},{lon});
  way["amenity"="hospital"](around:{radius_m},{lat},{lon});
);
out center;"""

    resp = requests.post(
        "https://overpass-api.de/api/interpreter",
        data={"data": query},
        timeout=40,
    )
    resp.raise_for_status()
    elements = resp.json().get("elements", [])

    hospitals = []
    for el in elements:
        tags  = el.get("tags", {})
        name  = tags.get("name") or tags.get("name:en") or "Unknown"
        addr  = tags.get("addr:full") or tags.get("addr:street") or ""
        phone = tags.get("phone") or tags.get("contact:phone") or ""

        if el.get("type") in ("way", "relation"):
            c   = el.get("center", {})
            h_lat, h_lon = c.get("lat"), c.get("lon")
        else:
            h_lat, h_lon = el.get("lat"), el.get("lon")

        if h_lat and h_lon:
            dist = round(_haversine(lat, lon, h_lat, h_lon), 2)
            hospitals.append({
                "name":     name,
                "address":  addr,
                "phone":    phone,
                "lat":      h_lat,
                "lon":      h_lon,
                "distance": dist,
                "type":     tags.get("amenity", "hospital"),
            })

    hospitals.sort(key=lambda x: x["distance"])
    return hospitals[:15]
