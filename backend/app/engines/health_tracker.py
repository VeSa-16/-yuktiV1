import logging

logger = logging.getLogger(__name__)

def calculate_health_status(monthly_revenue: float, monthly_expenses: float, emi: float) -> dict:
    """
    Calculates the business health status based on DSCR (Debt Service Coverage Ratio).
    DSCR = Net Operating Income / Debt Service (EMI)
    """
    noi = monthly_revenue - monthly_expenses
    
    if emi <= 0:
        dscr = 999.0
    else:
        dscr = noi / emi
        
    status = "healthy"
    message = "Your business is generating sufficient cash flow to cover expenses and loan payments."
    
    if dscr < 1.0:
        status = "critical"
        message = "Warning: Your net income is currently insufficient to cover your EMI. Immediate action required."
    elif dscr < 1.25:
        status = "warning"
        message = "Caution: Your cash flow is tight. Consider reducing expenses or exploring restructuring options."
        
    return {
        "monthly_revenue": monthly_revenue,
        "monthly_expenses": monthly_expenses,
        "emi": emi,
        "net_operating_income": noi,
        "dscr": round(dscr, 2),
        "status": status,
        "message": message
    }
