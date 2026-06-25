'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { IDay } from '@/types';

interface BudgetBreakdownProps {
  itinerary: IDay[];
  totalBudget: number;
  currency: string;
}

const CATEGORY_CONFIG = [
  { key: 'accommodation', label: 'Accommodation', color: '#6366f1' },
  { key: 'food', label: 'Food & Dining', color: '#f97316' },
  { key: 'activity', label: 'Activities', color: '#0ea5e9' },
  { key: 'transport', label: 'Transport', color: '#10b981' },
];

const CustomTooltip = ({ active, payload, currency }: { active?: boolean; payload?: Array<{name: string; value: number}>; currency: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(148, 163, 184, 0.15)',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
      }}>
        <p style={{ color: '#f8fafc', fontWeight: 600, marginBottom: '4px' }}>{payload[0].name}</p>
        <p style={{ color: '#0ea5e9', fontSize: '0.9rem' }}>{currency} {payload[0].value.toFixed(0)}</p>
      </div>
    );
  }
  return null;
};

export function BudgetBreakdown({ itinerary, totalBudget, currency }: BudgetBreakdownProps) {
  // Aggregate costs by category
  const categoryTotals = CATEGORY_CONFIG.map((cat) => {
    const total = itinerary.reduce((sum, day) => {
      return sum + day.activities
        .filter((a) => a.category === cat.key)
        .reduce((s, a) => s + (a.estimatedCost || 0), 0);
    }, 0);
    return { ...cat, value: total };
  }).filter((c) => c.value > 0);

  const totalSpent = categoryTotals.reduce((s, c) => s + c.value, 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const overBudget = totalSpent > totalBudget;

  if (categoryTotals.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
        No budget data available yet.
      </div>
    );
  }

  return (
    <div>
      {/* Pie Chart */}
      <div style={{ height: '280px', marginBottom: '24px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryTotals}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
            >
              {categoryTotals.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip currency={currency} />} />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {categoryTotals.map((cat) => (
          <div key={cat.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 12, height: 12, borderRadius: '3px', background: cat.color, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: '0.85rem', color: '#94a3b8' }}>{cat.label}</span>
            <div style={{ width: '40%', height: '4px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '2px' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (cat.value / totalSpent) * 100)}%`,
                background: cat.color,
                borderRadius: '2px',
              }} />
            </div>
            <span style={{ fontSize: '0.85rem', color: '#e2e8f0', fontWeight: 600, minWidth: '80px', textAlign: 'right' }}>
              {currency} {cat.value.toFixed(0)}
            </span>
          </div>
        ))}
      </div>

      {/* Budget summary */}
      <div style={{
        background: overBudget ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
        border: `1px solid ${overBudget ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
        borderRadius: '12px',
        padding: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Total Budget</span>
          <span style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>{currency} {totalBudget}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Estimated Cost</span>
          <span style={{ fontSize: '0.9rem', color: overBudget ? '#f87171' : '#34d399', fontWeight: 600 }}>{currency} {totalSpent.toFixed(0)}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(148, 163, 184, 0.1)', borderRadius: '3px', marginBottom: '8px' }}>
          <div style={{
            height: '100%',
            width: `${Math.min(100, (totalSpent / totalBudget) * 100)}%`,
            background: overBudget ? 'linear-gradient(90deg, #ef4444, #dc2626)' : 'linear-gradient(90deg, #0ea5e9, #10b981)',
            borderRadius: '3px',
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: '#475569' }}>
            {overBudget ? '⚠️ Over budget' : '✅ Within budget'}
          </span>
          <span style={{ fontSize: '0.85rem', color: overBudget ? '#f87171' : '#34d399', fontWeight: 600 }}>
            {overBudget ? '-' : '+'}{currency} {Math.abs(remaining).toFixed(0)} {overBudget ? 'over' : 'remaining'}
          </span>
        </div>
      </div>
    </div>
  );
}
