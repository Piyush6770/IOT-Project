from datetime import datetime, timezone
from app.models import Alert


BAD_POSTURES = {"Forward Lean", "Backward Lean", "Left Lean", "Right Lean", "Slouching"}


def build_alerts(chair_id: int, posture: str, sitting_minutes: float, bad_posture_minutes: float, heart_rate: float | None, heart_rate_threshold: int) -> list[Alert]:
    now = datetime.now(timezone.utc)
    alerts: list[Alert] = []
    if sitting_minutes > 60:
        alerts.append(Alert(chair_id=chair_id, alert_type="prolonged_sitting", message="You have been sitting continuously for over 60 minutes.", timestamp=now))
    if posture in BAD_POSTURES and bad_posture_minutes > 15:
        alerts.append(Alert(chair_id=chair_id, alert_type="bad_posture", message=f"{posture} posture detected for over 15 minutes.", timestamp=now))
    if heart_rate is not None and heart_rate > heart_rate_threshold:
        alerts.append(Alert(chair_id=chair_id, alert_type="high_heart_rate", message=f"Heart rate exceeds {heart_rate_threshold} BPM.", timestamp=now))
    return alerts
