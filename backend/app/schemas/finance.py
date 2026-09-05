from pydantic import BaseModel

class FinanceRequest(BaseModel):
    session_id: str
    margin_capital: float

class FinanceResponse(BaseModel):
    project_cost: float
    loan_amount: float
    beneficiary_contribution: float
