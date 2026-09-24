"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import { motion } from 'framer-motion';

export default function SkillsAssessment() {
  const [answers, setAnswers] = useState({
    has_accounts_exp: false,
    uses_smartphone: false,
    has_sales_exp: false
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleAnswer = (key: keyof typeof answers) => {
    setAnswers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const submitAssessment = async () => {
    setLoading(true);
    try {
      const data = await api.getSkillAssessment(answers);
      setResult(data);
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 text-warm-text animate-in fade-in duration-500">
      <div className="mb-8 mt-6 border-b border-warm-border pb-6 flex items-end gap-4">
        <GraduationCap size={40} className="text-warm-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entrepreneur Skill Assessment</h1>
          <p className="text-warm-muted mt-2">Identify skill gaps and map them to local government training programs.</p>
        </div>
      </div>

      {!submitted ? (
        <Card className="border-t-4 border-t-warm-primary max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Skill Survey</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer bg-warm-surface p-4 rounded-xl border border-warm-border hover:border-warm-primary transition-colors">
                <input type="checkbox" checked={answers.has_accounts_exp} onChange={() => toggleAnswer('has_accounts_exp')} className="w-5 h-5 accent-warm-primary" />
                <span className="font-bold">I have experience managing business accounts and cashflow.</span>
              </label>
              
              <label className="flex items-center space-x-3 cursor-pointer bg-warm-surface p-4 rounded-xl border border-warm-border hover:border-warm-primary transition-colors">
                <input type="checkbox" checked={answers.uses_smartphone} onChange={() => toggleAnswer('uses_smartphone')} className="w-5 h-5 accent-warm-primary" />
                <span className="font-bold">I am comfortable using a smartphone for digital payments (UPI).</span>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer bg-warm-surface p-4 rounded-xl border border-warm-border hover:border-warm-primary transition-colors">
                <input type="checkbox" checked={answers.has_sales_exp} onChange={() => toggleAnswer('has_sales_exp')} className="w-5 h-5 accent-warm-primary" />
                <span className="font-bold">I have previous experience in sales or local marketing.</span>
              </label>
            </div>

            <Button onClick={submitAssessment} disabled={loading} className="w-full py-6 uppercase font-bold tracking-wider mt-4">
              {loading ? "Analyzing..." : "Find Training Programs"}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="border-t-4 border-t-terminal-cyan">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl flex items-center justify-between">
                <span>Assessment Result</span>
                <span className={`px-3 py-1 rounded-full text-sm ${result.readiness_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  Score: {result.readiness_score}/100
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.recommended_trainings.length === 0 ? (
                <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                  <CheckCircle2 />
                  <span className="font-bold">You have the core skills needed. No mandatory training required.</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-warm-muted font-bold uppercase tracking-widest text-sm">Recommended Programs</p>
                  {result.recommended_trainings.map((t: any, i: number) => (
                    <div key={i} className="bg-warm-surface border border-warm-border p-4 rounded-xl flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-lg text-warm-primary">{t.name}</h4>
                        <div className="text-sm text-warm-muted flex gap-4 mt-1 font-sans">
                          <span>Provider: <strong className="text-warm-text">{t.provider}</strong></span>
                          <span>Duration: <strong>{t.duration}</strong></span>
                        </div>
                      </div>
                      <Button variant="outline" className="shrink-0 gap-2">Enroll <ArrowRight size={16} /></Button>
                    </div>
                  ))}
                </div>
              )}
              
              <Button onClick={() => setSubmitted(false)} variant="ghost" className="mt-6 w-full">Retake Assessment</Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
