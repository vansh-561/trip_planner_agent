'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, XCircle, Loader2, Send } from 'lucide-react';
import type { IDay } from '@/types';

interface ThinkingAgentUIProps {
  isActive: boolean;
  onComplete: (tripId: string) => void;
  onError: (error: string) => void;
  requestData: {
    origin: string;
    destination: string;
    budget: number;
    currency: string;
    startDate: string;
    endDate: string;
    preferences: string;
  };
}

interface LogLine {
  id: string;
  message: string;
  type: 'status' | 'complete' | 'error' | 'humanReview';
}

export function ThinkingAgentUI({ isActive, onComplete, onError, requestData }: ThinkingAgentUIProps) {
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error' | 'humanReview'>('idle');
  
  // HITL State
  const [draft, setDraft] = useState<IDay[] | null>(null);
  const [threadId, setThreadId] = useState<string>('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const logEndRef = useRef<HTMLDivElement>(null);
  const hasFired = useRef(false);

  // Auto-scroll to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Handle stream logic
  const handleStream = async (url: string, bodyData: any) => {
    setStatus('running');
    setIsSubmitting(false);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok || !response.body) {
        const errData = await response.json().catch(() => ({ error: 'Unknown error' }));
        setStatus('error');
        onError(errData.error || 'Failed to start agent');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split('\n').filter((l) => l.startsWith('data: '));

        for (const line of lines) {
          try {
            const jsonStr = line.replace(/^data: /, '');
            const event = JSON.parse(jsonStr);

            setLogs((prev) => [
              ...prev,
              { id: `${Date.now()}-${Math.random()}`, message: event.message, type: event.type },
            ]);

            if (event.type === 'complete') {
              setStatus('complete');
              onComplete(event.data?.tripId as string);
              return;
            }

            if (event.type === 'humanReview') {
              setStatus('humanReview');
              setDraft(event.data.draft);
              setThreadId(event.data.thread_id);
              return;
            }

            if (event.type === 'error') {
              setStatus('error');
              onError(event.message);
              return;
            }
          } catch {
            // Skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      setStatus('error');
      onError('Connection to agent failed');
    }
  };

  // Start the initial run
  useEffect(() => {
    if (!isActive || hasFired.current) return;
    hasFired.current = true;
    
    setLogs([{ id: Date.now().toString(), message: '🚀 Initializing Multi-Agent System...', type: 'status' }]);
    handleStream('/api/plan-trip', requestData);
  }, [isActive, requestData]);

  // Handle Human in the loop actions
  const handleFeedbackSubmit = (action: 'APPROVE' | 'REJECT') => {
    if (action === 'REJECT' && !feedback) return;
    setIsSubmitting(true);
    
    handleStream('/api/plan-trip/resume', {
      thread_id: threadId,
      action,
      feedback,
      tripDetails: { ...requestData, draft },
    });
    setFeedback(''); // clear for next round if any
  };

  if (!isActive && logs.length === 0) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          background: '#0a0f1a',
          border: '1px solid rgba(14, 165, 233, 0.25)',
          borderRadius: '16px',
          overflow: 'hidden',
          fontFamily: '"Fira Code", "Cascadia Code", monospace',
          boxShadow: '0 0 48px rgba(14, 165, 233, 0.1)',
        }}
      >
        {/* Terminal title bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 16px',
          background: 'rgba(14, 165, 233, 0.06)',
          borderBottom: '1px solid rgba(14, 165, 233, 0.12)',
        }}>
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
          <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
          <div style={{ marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} color="#94a3b8" />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>wanderlust-supervisor — zsh</span>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            {status === 'running' && <Loader2 size={14} color="#0ea5e9" style={{ animation: 'spin-slow 1s linear infinite' }} />}
            {status === 'complete' && <CheckCircle size={14} color="#10b981" />}
            {status === 'error' && <XCircle size={14} color="#ef4444" />}
          </div>
        </div>

        {/* Log area */}
        <div style={{
          padding: '20px',
          minHeight: '240px',
          maxHeight: '360px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          <AnimatePresence>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}
              >
                <span style={{ color: '#475569', fontSize: '0.8rem', flexShrink: 0 }}>
                  {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span style={{
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: log.type === 'error' ? '#f87171' : log.type === 'complete' ? '#34d399' : log.type === 'humanReview' ? '#f59e0b' : '#e2e8f0',
                }}>
                  {log.message}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Blinking cursor */}
          {status === 'running' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: '#475569', fontSize: '0.8rem' }}>now</span>
              <span style={{ fontSize: '0.85rem', color: '#0ea5e9' }}>
                ${'  '}
                <span style={{
                  display: 'inline-block', width: '8px', height: '14px',
                  background: '#0ea5e9', verticalAlign: 'middle',
                  animation: 'blink 1s step-end infinite',
                }} />
              </span>
            </div>
          )}

          <div ref={logEndRef} />
        </div>
      </motion.div>

      {/* HITL UI (Human Review) */}
      {status === 'humanReview' && draft && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '16px',
            padding: '24px',
          }}
        >
          <h3 style={{ color: '#fcd34d', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} />
            Draft Ready for Review
          </h3>
          <p style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '20px' }}>
            The AI team has compiled a draft itinerary. You can approve it now, or provide feedback (e.g. "Find cheaper hotels" or "Add more museums on day 2") for the agents to revise.
          </p>

          {/* Draft Summary Display */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            maxHeight: '320px',
            overflowY: 'auto'
          }}>
            <h4 style={{ color: '#f8fafc', marginBottom: '12px', fontSize: '0.95rem', fontWeight: 600 }}>Draft Summary</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {draft.map((day, idx) => (
                <div key={idx} style={{ paddingBottom: idx !== draft.length - 1 ? '16px' : '0', borderBottom: idx !== draft.length - 1 ? '1px solid rgba(148, 163, 184, 0.1)' : 'none' }}>
                  <div style={{ color: '#0ea5e9', fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>
                    Day {day.dayNumber}: {day.date} — {day.title}
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                    {day.activities?.map((act, i) => (
                      <li key={i}>
                        <strong style={{ color: '#e2e8f0' }}>{act.time}</strong> at {act.location} <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>({act.category})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <textarea
              className="input"
              placeholder="Any changes? (Leave blank if you want to approve as is)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              style={{ minHeight: '80px', resize: 'vertical' }}
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, justifyContent: 'center', background: '#10b981', color: 'white', border: 'none' }}
                onClick={() => handleFeedbackSubmit('APPROVE')}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                Approve & Finalize
              </button>
              <button 
                className="btn btn-ghost" 
                style={{ flex: 1, justifyContent: 'center', border: '1px solid #f59e0b', color: '#f59e0b' }}
                onClick={() => handleFeedbackSubmit('REJECT')}
                disabled={!feedback.trim() || isSubmitting}
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                Send Feedback to Agents
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
