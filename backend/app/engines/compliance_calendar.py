def get_compliance_calendar(monthly_revenue: float, business_type: str) -> dict:
    """
    Generates a compliance calendar based on revenue thresholds and business type.
    """
    annual_revenue = monthly_revenue * 12
    
    # GST threshold in India for goods is 40 Lakhs, services is 20 Lakhs
    gst_threshold = 4000000 if "retail" in business_type.lower() or "dairy" in business_type.lower() or "mill" in business_type.lower() else 2000000
    
    needs_gst = annual_revenue >= gst_threshold
    
    calendar = []
    
    # Universal compliances
    calendar.append({
        "task": "Udyam (MSME) Registration",
        "frequency": "One-time",
        "deadline": "Before starting operations",
        "required": True,
        "note": "Required to avail government subsidies and lower interest rates."
    })
    
    calendar.append({
        "task": "Income Tax Return (ITR-4 Sugam)",
        "frequency": "Annual",
        "deadline": "July 31",
        "required": True,
        "note": "Presumptive taxation scheme for small businesses under Section 44AD."
    })
    
    # Conditional compliances
    calendar.append({
        "task": "GST Registration & GSTR-3B Filing",
        "frequency": "Monthly/Quarterly",
        "deadline": "20th of next month",
        "required": needs_gst,
        "note": f"Required because your projected annual revenue (₹{annual_revenue:,.0f}) exceeds the ₹{gst_threshold:,.0f} threshold." if needs_gst else f"Not required yet. Your projected revenue (₹{annual_revenue:,.0f}) is below the ₹{gst_threshold:,.0f} threshold."
    })
    
    if "dairy" in business_type.lower() or "poultry" in business_type.lower() or "food" in business_type.lower():
        calendar.append({
            "task": "FSSAI Basic Registration",
            "frequency": "Annual Renewal",
            "deadline": "30 days before expiry",
            "required": True,
            "note": "Mandatory for all food-related businesses with turnover < ₹12 Lakhs."
        })
        
    return {
        "annual_revenue_projection": annual_revenue,
        "needs_gst": needs_gst,
        "calendar": calendar
    }
