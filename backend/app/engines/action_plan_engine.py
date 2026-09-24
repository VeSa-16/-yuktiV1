"""
================================================================================
YUKTI DETERMINISTIC ACTION PLAN ENGINE
================================================================================

[ARCHITECTURE BOUNDARY: STRICT DETERMINISTIC]
This module contains 100% deterministic, rule-based logic for task selection 
and sequencing. It generates execution roadmaps based on predefined task pools, 
filtered by business profile attributes (stage, category, capital).
NO LLM OR GENERATIVE AI CALLS ARE PERMITTED IN THIS MODULE.

================================================================================
"""

import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

# Master Library of Tasks
# Each task has criteria that must match the business profile for it to be included.
TASK_LIBRARY = [
    # FOUNDATION PHASE (Days 1-30)
    {
        "id": "t_udyam",
        "phase": "Foundation",
        "title": "Register {business_name} on the Udyam Portal for MSME Benefits",
        "owner": "You",
        "days_range": "Days 1-7",
        "conditions": {"stages": ["New Idea", "Startup"]}
    },
    {
        "id": "t_bank",
        "phase": "Foundation",
        "title": "Open a dedicated Current Bank Account in {location_name}",
        "owner": "You",
        "days_range": "Days 1-10",
        "conditions": {"stages": ["New Idea", "Startup"]}
    },
    {
        "id": "t_loan",
        "phase": "Foundation",
        "title": "Submit Loan Application to matched scheme",
        "owner": "You / Your CA",
        "days_range": "Days 10-20",
        "conditions": {"stages": ["New Idea", "Startup", "Established"]}
    },
    {
        "id": "t_fssai",
        "phase": "Foundation",
        "title": "Apply for FSSAI License",
        "owner": "You",
        "days_range": "Days 15-30",
        "conditions": {"categories": ["food_beverage", "retail_kirana"], "stages": ["New Idea", "Startup"]}
    },
    {
        "id": "t_audit",
        "phase": "Foundation",
        "title": "Complete independent financial audit for expansion",
        "owner": "Your CA",
        "days_range": "Days 1-15",
        "conditions": {"stages": ["Established"]}
    },
    
    # SETUP PHASE (Days 31-60)
    {
        "id": "t_machinery",
        "phase": "Setup",
        "title": "Procure core machinery from registered local vendors",
        "owner": "You",
        "days_range": "Days 31-45",
        "linkUrl": "/marketplace", 
        "linkText": "Find Vendors",
        "conditions": {"categories": ["manufacturing", "agri_business", "food_beverage", "apparel_textiles"], "stages": ["New Idea", "Startup"]}
    },
    {
        "id": "t_premises",
        "phase": "Setup",
        "title": "Secure lease agreement for commercial premises in {location_name}",
        "owner": "You",
        "days_range": "Days 31-40",
        "conditions": {"stages": ["New Idea", "Startup"]}
    },
    {
        "id": "t_hiring",
        "phase": "Setup",
        "title": "Hire initial staff members",
        "owner": "You",
        "days_range": "Days 40-60",
        "conditions": {"stages": ["New Idea", "Startup", "Established"]}
    },
    {
        "id": "t_supplychain",
        "phase": "Setup",
        "title": "Renegotiate supply chain contracts for higher volume",
        "owner": "You",
        "days_range": "Days 31-50",
        "conditions": {"stages": ["Established"]}
    },

    # LAUNCH PHASE (Days 61-90)
    {
        "id": "t_inventory",
        "phase": "Launch",
        "title": "Stock initial inventory for {category_name}",
        "owner": "You",
        "days_range": "Days 61-70",
        "conditions": {"stages": ["New Idea", "Startup"]}
    },
    {
        "id": "t_marketing",
        "phase": "Launch",
        "title": "Execute local marketing campaign across {location_name}",
        "owner": "Marketing Agency / You",
        "days_range": "Days 70-85",
        "conditions": {"stages": ["New Idea", "Startup", "Established"]}
    },
    {
        "id": "t_softlaunch",
        "phase": "Launch",
        "title": "Soft Launch and initial sales tracking",
        "owner": "You",
        "days_range": "Days 85-90",
        "conditions": {"stages": ["New Idea", "Startup"]}
    },
    {
        "id": "t_expansion",
        "phase": "Launch",
        "title": "Launch new branch or expanded product line",
        "owner": "You",
        "days_range": "Days 80-90",
        "conditions": {"stages": ["Established"]}
    }
]

def generate_action_plan(
    category_id: str,
    category_name: str,
    location_name: str,
    stage: str,
    business_name: str = "your business"
) -> List[Dict[str, Any]]:
    """
    Deterministically selects and sequences tasks based on the business profile.
    """
    logger.info(f"Generating deterministic action plan for {category_id}, {stage}")
    
    # Default to Startup if stage is missing or unknown
    if stage not in ["New Idea", "Startup", "Established"]:
        stage = "Startup"
        
    if not business_name or business_name.strip() == "":
        business_name = "your business"
        
    filtered_tasks = []
    
    for task in TASK_LIBRARY:
        conds = task.get("conditions", {})
        
        # Check stage
        if "stages" in conds and stage not in conds["stages"]:
            continue
            
        # Check category
        if "categories" in conds and category_id not in conds["categories"]:
            continue
            
        # Task passed filters
        # Format title with profile variables
        title = task["title"].format(
            category_name=category_name,
            location_name=location_name,
            business_name=business_name
        )
        
        t = {
            "id": task["id"],
            "title": f"[{task['owner']} • {task['days_range']}] {title}",
            "completed": False,
            "phase": task["phase"]
        }
        
        if "linkUrl" in task:
            t["linkUrl"] = task["linkUrl"]
            t["linkText"] = task["linkText"]
            
        filtered_tasks.append(t)
        
    # Group by phase
    milestones = [
        {"id": "m1", "title": "Phase 1: Foundation (Days 1-30)", "tasks": []},
        {"id": "m2", "title": "Phase 2: Setup (Days 31-60)", "tasks": []},
        {"id": "m3", "title": "Phase 3: Launch (Days 61-90)", "tasks": []}
    ]
    
    for t in filtered_tasks:
        if t["phase"] == "Foundation":
            milestones[0]["tasks"].append(t)
        elif t["phase"] == "Setup":
            milestones[1]["tasks"].append(t)
        elif t["phase"] == "Launch":
            milestones[2]["tasks"].append(t)
            
    # Clean up the internal phase key
    for m in milestones:
        for t in m["tasks"]:
            del t["phase"]
            
    return milestones
