"""Model boundary for a future IsolationForest trained only on authorized data."""
from sklearn.ensemble import IsolationForest

def build_model():
    return IsolationForest(random_state=42, contamination='auto')
