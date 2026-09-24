from datetime import datetime, timedelta

def get_tracked_schemes(applied_scheme_ids: list[str]) -> list:
    """
    Mock implementation of a scheme tracker that shows application status and deadlines.
    """
    # In a real app, this would query a DB table of user applications
    tracked = []
    
    now = datetime.now()
    
    if "nsfdc_term_loan" in applied_scheme_ids:
        tracked.append({
            "id": "nsfdc_term_loan",
            "name": "NSFDC Term Loan",
            "status": "In Progress",
            "progress_pct": 40,
            "next_step": "Document Verification",
            "deadline": (now + timedelta(days=14)).strftime("%Y-%m-%d"),
            "notes": "Pending Aadhaar verification by SCA."
        })
        
    if "mudra_shishu" in applied_scheme_ids:
        tracked.append({
            "id": "mudra_shishu",
            "name": "PMMY Shishu Loan",
            "status": "Approved",
            "progress_pct": 100,
            "next_step": "Disbursement",
            "deadline": (now + timedelta(days=2)).strftime("%Y-%m-%d"),
            "notes": "Bank has approved the loan. Waiting for NEFT transfer."
        })
        
    return tracked
