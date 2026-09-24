import logging

logger = logging.getLogger(__name__)

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

def generate_cashflow_forecast(peak_seasons: list[str], lean_season: str, average_monthly_revenue: float) -> dict:
    """
    Generates a 12-month cashflow forecast multiplying average revenue by seasonal factors.
    Peak seasons get a 1.5x multiplier, lean seasons get 0.6x, normal months get 1.0x.
    """
    forecast = []
    
    peak_months = set()
    for p in peak_seasons:
        for m in MONTHS:
            if m.lower() in p.lower():
                peak_months.add(m)
                
    lean_months = set()
    for m in MONTHS:
        if m.lower() in lean_season.lower():
            lean_months.add(m)
            
    for month in MONTHS:
        multiplier = 1.0
        if month in peak_months:
            multiplier = 1.5
        elif month in lean_months:
            multiplier = 0.6
            
        forecast.append({
            "month": month,
            "projected_revenue": round(average_monthly_revenue * multiplier),
            "seasonality": "peak" if multiplier > 1.0 else "lean" if multiplier < 1.0 else "normal",
            "multiplier": multiplier
        })
        
    return {
        "forecast": forecast,
        "peak_months": list(peak_months),
        "lean_months": list(lean_months)
    }
