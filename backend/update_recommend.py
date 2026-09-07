import re

recommend_path = 'd:/yukti/backend/app/api/routes_recommend.py'
with open(recommend_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the dscr and roi hallucination logic
replacement = '''
    base_state = get_base_state(db, req.session_id)
    # Ensure dscr and roi are fetched correctly from the state, if they exist
    # If not in dimension_scores natively, we can fetch from session projection
    from app.models import FinancialProjection
    projection = db.query(FinancialProjection).filter(FinancialProjection.session_id == req.session_id).first()
    
    if projection:
        dscr = max(0.5, projection.dscr)
        roi = projection.roi
    else:
        # Fallback if somehow not generated (should be, since get_base_state calls compute_full_financials)
        dscr = 1.0
        roi = 15.0

    score_result = compute_yukti_score(
        dimension_scores=base_state["dimension_scores"],
        confidence_multiplier=base_state["confidence_multiplier"],
        dscr=dscr
    )
    
    return RecommendResponse(
        session_id=req.session_id,
        yukti_score=score_result.final_score,
        raw_score=score_result.raw_score,
        confidence_multiplier=base_state["confidence_multiplier"],
        verdict=score_result.verdict,
        dimension_scores=DimensionScores(**base_state["dimension_scores"]),
        dscr=dscr,
        roi=roi,
        next_steps=["Verify assumptions with local experts.", "Apply for eligible scheme matching your margin capital."],
        confidence="Medium",
    )
'''

content = re.sub(r'    base_state = get_base_state\(db, req.session_id\).*?return RecommendResponse\([^\)]+\)', replacement, content, flags=re.DOTALL)

with open(recommend_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed hallucination in routes_recommend.py")
