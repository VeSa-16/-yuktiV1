from fastapi import APIRouter
from app.schemas.finance import FinanceRequest, FinanceResponse
from app.engines.financial_engine import compute_project_cost, compute_loan_amount

router = APIRouter()

@router.post("/calculate-finance", response_model=FinanceResponse)
def calculate_finance(req: FinanceRequest):
    project_cost = compute_project_cost(req.margin_capital)
    loan_amount = compute_loan_amount(project_cost)
    contribution = project_cost - loan_amount
    return FinanceResponse(project_cost=project_cost, loan_amount=loan_amount,
                            beneficiary_contribution=contribution)
