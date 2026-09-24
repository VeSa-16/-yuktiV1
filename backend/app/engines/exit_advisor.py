def get_exit_advice(revenue_drop_pct: float, current_dscr: float, category: str) -> dict:
    """
    Provides restructuring or pivot advice based on severe stress test results.
    """
    if revenue_drop_pct < 20 and current_dscr >= 1.0:
        return {
            "status": "Safe",
            "action": "Maintain operations. Build cash buffer.",
            "options": []
        }
        
    options = []
    
    # Restructuring options
    options.append({
        "type": "Restructuring",
        "title": "Apply for Loan Moratorium",
        "description": "Request a 3-6 month EMI holiday from your lender due to temporary revenue loss. Interest will continue to accrue."
    })
    
    options.append({
        "type": "Restructuring",
        "title": "Tenure Extension",
        "description": "Restructure your loan to extend the tenure by 1-2 years, significantly reducing your monthly EMI."
    })
    
    # Pivot options based on severity
    if revenue_drop_pct >= 40 or current_dscr < 0.8:
        pivot_idea = "General Trading"
        if "dairy" in category.lower():
            pivot_idea = "Value-added Dairy (Paneer/Ghee) or Animal Feed"
        elif "tailoring" in category.lower():
            pivot_idea = "Ready-made Garment Retail or Alteration Services"
            
        options.append({
            "type": "Pivot",
            "title": f"Pivot Business Model: {pivot_idea}",
            "description": "Your current model is highly vulnerable. Consider utilizing your existing assets to serve this adjacent market with better margins."
        })
        
    return {
        "status": "At Risk" if current_dscr < 1.0 else "Stressed",
        "action": "Immediate financial restructuring recommended to avoid default.",
        "options": options
    }
