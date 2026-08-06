"""
Shared geospatial helper. Plain-Python haversine distance - no PostGIS
dependency, since the project stores latitude/longitude as plain
floats (see README roadmap: PostGIS is a planned but not-yet-done
migration). Both duplicate detection and notification matching need
"distance between two lat/lng points," so it lives here once instead
of being redefined in each caller.
"""

import math

_EARTH_RADIUS_METERS = 6_371_000


def haversine_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Straight-line distance in meters between two lat/lng points."""

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    )

    return 2 * _EARTH_RADIUS_METERS * math.asin(math.sqrt(a))
