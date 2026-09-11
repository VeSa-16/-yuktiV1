from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class DataSource(BaseModel):
    field: str
    value: Any
    source: str
    confidence: str

class ProposalMetadata(BaseModel):
    proposal_id: str
    generated_at: str
    location: str
    business_category: str
    data_confidence: str

class ExecutiveSummary(BaseModel):
    business_overview: str
    opportunity: str
    recommendation: str
    key_metrics: Dict[str, Any]

class ProjectCost(BaseModel):
    total_project_cost: float
    own_contribution: float
    financing_required: float
    
class ProfitabilityAnalysis(BaseModel):
    roi: float
    dscr: float
    break_even: float

class BusinessPlan(BaseModel):
    proposal_metadata: ProposalMetadata
    executive_summary: ExecutiveSummary
    entrepreneur_profile: Dict[str, Any] = Field(default_factory=dict)
    proposed_business: Dict[str, Any] = Field(default_factory=dict)
    local_market_analysis: Dict[str, Any] = Field(default_factory=dict)
    competition_analysis: Dict[str, Any] = Field(default_factory=dict)
    products_and_services: List[Dict[str, Any]] = Field(default_factory=list)
    infrastructure_and_equipment: Dict[str, Any] = Field(default_factory=dict)
    project_cost: ProjectCost
    financial_structure: Dict[str, Any] = Field(default_factory=dict)
    revenue_projection: Dict[str, Any] = Field(default_factory=dict)
    operating_expenses: Dict[str, Any] = Field(default_factory=dict)
    cash_flow_projection: Dict[str, Any] = Field(default_factory=dict)
    profitability_analysis: ProfitabilityAnalysis
    risk_analysis: Dict[str, Any] = Field(default_factory=dict)
    swot_analysis: Dict[str, Any] = Field(default_factory=dict)
    marketing_strategy: Dict[str, Any] = Field(default_factory=dict)
    implementation_plan: Dict[str, Any] = Field(default_factory=dict)
    ninety_day_action_plan: List[Dict[str, Any]] = Field(default_factory=list)
    financing_readiness: Dict[str, Any] = Field(default_factory=dict)
    required_documents: List[str] = Field(default_factory=list)
    scheme_information: Dict[str, Any] = Field(default_factory=dict)
    assumptions: List[str] = Field(default_factory=list)
    data_sources: List[DataSource] = Field(default_factory=list)
    conclusion: Dict[str, Any] = Field(default_factory=dict)
