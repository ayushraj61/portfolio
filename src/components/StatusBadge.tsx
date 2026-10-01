'use client';

import { ProductStatus } from '@/data/products';

// ========================================
// STATUS BADGE — Product maturity indicators
// LIVE / BUILDING / EXPERIMENT / ONGOING / CONCEPT
// Per section 19 & 43 — honest maturity labels
// ========================================

const statusConfig: Record<ProductStatus, { label: string; className: string }> = {
  live: { label: 'Live', className: 'status-live' },
  building: { label: 'Building', className: 'status-building' },
  experiment: { label: 'Experiment', className: 'status-experiment' },
  ongoing: { label: 'Ongoing', className: 'status-ongoing' },
  concept: { label: 'Concept', className: 'status-concept' },
};

interface StatusBadgeProps {
  status: ProductStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`status-badge ${config.className}`}>
      <span className="status-badge-dot" />
      {config.label}
    </span>
  );
}
