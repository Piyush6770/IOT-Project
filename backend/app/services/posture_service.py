from dataclasses import dataclass


POSTURES = ("Correct", "Forward Lean", "Backward Lean", "Left Lean", "Right Lean", "Slouching", "No User")


@dataclass(frozen=True)
class PostureResult:
    posture_type: str
    confidence: float


def classify_posture(pressure1: float, pressure2: float, pressure3: float, pressure4: float) -> PostureResult:
    values = (pressure1, pressure2, pressure3, pressure4)
    total = sum(values)
    if total < 15:
        return PostureResult("No User", 99.0)

    top = pressure1 + pressure2
    bottom = pressure3 + pressure4
    left = pressure1 + pressure3
    right = pressure2 + pressure4
    left_right_diff = abs(left - right)
    top_bottom_diff = abs(top - bottom)

    if left_right_diff > max(25, total * 0.20):
        posture = "Left Lean" if left > right else "Right Lean"
        confidence = min(99.0, 70.0 + left_right_diff / max(total, 1) * 100)
    elif top_bottom_diff > max(30, total * 0.25):
        posture = "Backward Lean" if top > bottom else "Forward Lean"
        confidence = min(99.0, 70.0 + top_bottom_diff / max(total, 1) * 100)
    elif bottom / total > 0.68:
        posture, confidence = "Slouching", 92.0
    else:
        posture, confidence = "Correct", 96.0
    return PostureResult(posture, round(confidence, 2))
