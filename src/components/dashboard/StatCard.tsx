import { type JSX, type ReactNode } from 'react';
import { Card, Icon, type IconName } from '@/components/ui';

export interface StatCardProps {
  label: string;
  value: string;
  icon?: IconName;
  children?: ReactNode;
}

/** Headline metric card: a label, a large value, and optional supporting content. */
export function StatCard({ label, value, icon, children }: StatCardProps): JSX.Element {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-primary-dark">
        {icon ? (
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Icon name={icon} size={20} />
          </span>
        ) : null}
        <p className="text-sm font-medium uppercase tracking-wide">{label}</p>
      </div>
      <p className="font-display text-4xl font-bold text-ink">{value}</p>
      {children}
    </Card>
  );
}
