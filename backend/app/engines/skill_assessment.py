import logging

logger = logging.getLogger(__name__)

# Mock database of training programs
TRAINING_PROGRAMS = {
    "accounts": {
        "name": "Basic Financial Literacy & Accounting",
        "provider": "RSETI (Rural Self Employment Training Institute)",
        "duration": "5 Days",
        "type": "Skill Gap"
    },
    "digital": {
        "name": "Digital Literacy & Smartphone Payments",
        "provider": "PMGDISHA",
        "duration": "10 Days",
        "type": "Skill Gap"
    },
    "marketing": {
        "name": "Local Marketing & Customer Acquisition",
        "provider": "NRLM (National Rural Livelihoods Mission)",
        "duration": "3 Days",
        "type": "Growth"
    }
}

def assess_skills(answers: dict) -> dict:
    """
    Evaluates answers to the skill assessment survey and recommends training.
    Expected answers: {"has_accounts_exp": bool, "uses_smartphone": bool, "has_sales_exp": bool}
    """
    recommended_trainings = []
    
    if not answers.get("has_accounts_exp"):
        recommended_trainings.append(TRAINING_PROGRAMS["accounts"])
        
    if not answers.get("uses_smartphone"):
        recommended_trainings.append(TRAINING_PROGRAMS["digital"])
        
    if not answers.get("has_sales_exp"):
        recommended_trainings.append(TRAINING_PROGRAMS["marketing"])
        
    score = 100
    if len(recommended_trainings) == 1:
        score = 80
    elif len(recommended_trainings) == 2:
        score = 60
    elif len(recommended_trainings) >= 3:
        score = 40
        
    return {
        "readiness_score": score,
        "recommended_trainings": recommended_trainings,
        "status": "Ready" if score >= 80 else "Training Recommended" if score >= 60 else "Training Required"
    }
