from app.services.alert_service import build_alerts
from app.services.posture_service import classify_posture
from app.services.sedentary_service import calculate_sedentary_index


def test_posture_classifier_supports_empty_and_balanced_seat():
    assert classify_posture(0, 0, 0, 0).posture_type == "No User"
    assert classify_posture(34, 36, 42, 40).posture_type == "Correct"


def test_posture_classifier_detects_directional_lean():
    assert classify_posture(85, 15, 80, 20).posture_type == "Left Lean"
    assert classify_posture(15, 85, 20, 80).posture_type == "Right Lean"


def test_sbi_formula_and_risk_boundaries():
    result = calculate_sedentary_index(480, 100, 8, 75)
    assert result.sedentary_index == 40.0
    assert result.risk_level == "Mild Risk"
    assert calculate_sedentary_index(0, 100, 8, 75).risk_level == "Healthy"


def test_alert_thresholds():
    alerts = build_alerts(1, "Slouching", 61, 16, 121, 120)
    assert {alert.alert_type for alert in alerts} == {"prolonged_sitting", "bad_posture", "high_heart_rate"}
