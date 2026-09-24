# YUKTI - Pre-Investment Decision Traceable Chain

**SIH 2026 (PS 26091)**

The components of rural entrepreneurship viability are established. YUKTI's differentiation is making the **pre-investment decision traceable** — local evidence, financial feasibility, financing schemes, and stress-testing are completely connected and exposed, not hidden inside a black-box AI.

YUKTI acts as an evidence-backed deterministic decision engine. Generative AI is explicitly isolated as a semantic router, completely barred from financial calculations.

---

## Architecture & Honesty Disclosure

**Our Only Defense Against Technical Scrutiny is Honesty:**
- **Deterministic Math Only:** Our financial engine (`app/engines/financial_engine.py`) and scoring engine (`app/engines/scoring_engine.py`) are 100% deterministic mathematical layers that operate on closed-form calculations (ROI, DSCR, EMI, Break-even). No LLM hallucinations are permitted in the financial pathway.
- **AI as a Semantic Router:** The LLM (`app/ai_layer/business_matcher.py`) is used exclusively to translate unstructured user ideas into strict, pre-defined static dataset schema categories.
- **No Fabricated Live Data:** Our prototype explicitly covers the **Solapur District**. Any attempt to generate an analysis outside of Solapur will gracefully fail with a transparent `OUT_OF_COVERAGE` message. We do not mock "live" endpoints and pass them off as real outside our validated domain.
- **Offline Reliability:** The core flow and engine works flawlessly offline, demonstrating robustness for remote environments.

---

## Live Demo Script: The 10/10 Rehearsed Moment

This is the exact sequence to run during the Nationals judging presentation to highlight the live What-If simulation:

> **Speaker:** "Judges, numbers on a static business plan don't survive contact with reality. YUKTI isn't just generating a PDF; it's a living financial model. Let me demonstrate."

1. **Step 1:** Complete the intake for a "Kirana Store" in "Solapur" with "1 Lakh" capital.
2. **Step 2:** Land on the Dashboard. Point to the base numbers.
   > **Speaker:** "Here is the baseline. 25,000 INR expected monthly net profit. A safe DSCR of 1.8. Break-even at 50,000 INR revenue."
3. **Step 3:** Open the **Live What-If Scenario Slider**.
   > **Speaker:** "What if a drought hits Solapur and demand drops by 20%? I drag the Demand slider to -20%."
4. **Step 4:** Watch the cascade update live on-screen (via `/api/analysis/generate` simulation mode).
   > **Speaker:** "Notice the immediate, deterministic cascade. The DSCR just dropped to 1.1 — we are now in the danger zone for loan repayment. The break-even unit threshold remains unchanged, but our revenue projections shrink, and our final risk score just downgraded from 'Safe' to 'Marginal'. We didn't ask an LLM to guess this; our deterministic financial engine calculated the precise cascade based on the Solapur dataset."

---

## Testing the Deterministic Engine

We have a comprehensive pytest suite proving the mathematical boundaries of our engines and testing the cascade logic.

Run the test suite via:
```bash
# In the backend directory
pytest tests/
```
