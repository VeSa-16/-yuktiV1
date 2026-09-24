import random

def get_peer_benchmarks(category_name: str, district: str, yukti_score: int) -> dict:
    """
    Generates peer benchmarking data based on the user's score vs a simulated local aggregate.
    """
    # Mock average score based on user's score to ensure they are usually near or slightly above average
    # In a real system, this would aggregate `select avg(score) from users where category = x`
    base_avg = max(50, min(85, yukti_score + random.randint(-15, 5)))
    
    top_practices = [
        "Maintains a daily ledger of all cash transactions",
        "Reinvests 20% of profits back into inventory",
        "Uses digital payments (UPI) for 80% of sales",
        "Maintains a cash buffer equal to 2 months of EMI"
    ]
    
    # Pick 2 random practices
    random.seed(len(category_name) + len(district)) # stable randomness
    practices = random.sample(top_practices, 2)
    
    return {
        "peer_group_size": random.randint(40, 120),
        "district": district.title(),
        "category": category_name.title(),
        "average_score": base_avg,
        "user_score": yukti_score,
        "percentile": round(100 - ((100 - yukti_score) * 0.8)), # rough mock percentile
        "top_practices": practices
    }
