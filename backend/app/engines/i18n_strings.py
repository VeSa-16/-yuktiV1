# Deterministic translation lookup for hardcoded UI strings

I18N_DICT = {
    "en": {
        "verdicts": {
            "insufficient": "Insufficient Evidence",
            "strong": "Strong Opportunity",
            "moderate": "Moderate Potential",
            "high_risk": "High Risk"
        },
        "next_steps": {
            "restructure_loan": {"action": "Restructure loan amount", "reason": "Debt service coverage ratio (DSCR) is too low to comfortably service the EMI."},
            "stress_test": {"action": "Stress-test margins", "reason": "Expected net margins are below the safe threshold for this sector."},
            "analyze_competitors": {"action": "Analyze local competitors", "reason": "Competitor density is high relative to the target population."},
            "review_threats": {"action": "Review identified threats", "reason": "Several structural risks were identified in the market data."},
            "proceed": {"action": "Proceed to Business Plan", "reason": "All core metrics look healthy. Begin formalizing the launch strategy."}
        }
    },
    "hi": {
        "verdicts": {
            "insufficient": "अपर्याप्त डेटा (Insufficient Evidence)",
            "strong": "मजबूत अवसर (Strong Opportunity)",
            "moderate": "मध्यम क्षमता (Moderate Potential)",
            "high_risk": "उच्च जोखिम (High Risk)"
        },
        "next_steps": {
            "restructure_loan": {"action": "ऋण राशि का पुनर्गठन करें", "reason": "ईएमआई चुकाने के लिए ऋण सेवा कवरेज अनुपात (DSCR) बहुत कम है।"},
            "stress_test": {"action": "मार्जिन का परीक्षण करें", "reason": "अपेक्षित शुद्ध मार्जिन इस क्षेत्र के लिए सुरक्षित सीमा से नीचे है।"},
            "analyze_competitors": {"action": "स्थानीय प्रतिस्पर्धियों का विश्लेषण करें", "reason": "लक्षित जनसंख्या के सापेक्ष प्रतिस्पर्धी घनत्व अधिक है।"},
            "review_threats": {"action": "पहचाने गए खतरों की समीक्षा करें", "reason": "बाजार डेटा में कई संरचनात्मक जोखिमों की पहचान की गई।"},
            "proceed": {"action": "व्यवसाय योजना के साथ आगे बढ़ें", "reason": "सभी मुख्य मेट्रिक्स स्वस्थ दिख रहे हैं। लॉन्च रणनीति को औपचारिक रूप देना शुरू करें।"}
        }
    }
}
