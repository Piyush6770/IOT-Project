from dataclasses import dataclass


@dataclass(frozen=True)
class SedentaryResult:
    sitting_duration: float
    break_count: int
    sedentary_index: float
    risk_level: str


def risk_level_for(score: float) -> str:
    if score <= 25:
        return "Healthy"
    if score <= 50:
        return "Mild Risk"
    if score <= 75:
        return "Moderate Risk"
    return "High Risk"


def calculate_sedentary_index(sitting_minutes: float, posture_quality: float, break_count: int, heart_rate: float | None) -> SedentaryResult:
    duration_score = min(100.0, sitting_minutes / 480.0 * 100.0)
    posture_score = max(0.0, min(100.0, 100.0 - posture_quality))
    break_score = max(0.0, 100.0 - min(100.0, break_count / 8.0 * 100.0))
    if heart_rate is None:
        heart_rate_score = 50.0
    else:
        heart_rate_score = min(100.0, max(0.0, abs(heart_rate - 75.0) * 2.0))
    index = round(0.4 * duration_score + 0.3 * posture_score + 0.2 * break_score + 0.1 * heart_rate_score, 2)
    return SedentaryResult(sitting_minutes, break_count, index, risk_level_for(index))
