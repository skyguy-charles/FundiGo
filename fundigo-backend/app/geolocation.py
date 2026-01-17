from math import radians, sin, cos, sqrt, atan2

def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Calculate distance between two points in kilometers"""
    R = 6371  # Earth radius in km
    
    lat1, lng1, lat2, lng2 = map(radians, [lat1, lng1, lat2, lng2])
    
    dlat = lat2 - lat1
    dlng = lng2 - lng1
    
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlng/2)**2
    c = 2 * atan2(sqrt(a), sqrt(1-a))
    
    return R * c

def find_nearby(user_lat: float, user_lng: float, mechanics: list, radius_km: float = 10):
    """Find mechanics within radius"""
    nearby = []
    for mechanic in mechanics:
        if mechanic.lat and mechanic.lng:
            distance = haversine_distance(user_lat, user_lng, mechanic.lat, mechanic.lng)
            if distance <= radius_km:
                nearby.append({
                    "mechanic": mechanic,
                    "distance": round(distance, 2)
                })
    
    return sorted(nearby, key=lambda x: x["distance"])
