type StatTileProps = {
  label: string;
  value: string | number;
  hint?: string;
};

function StatTile({ label, value, hint }: StatTileProps) {
  return (
    <div className="rounded-xl bg-surface-container p-4 shadow-elevation-2">
      <dt className="text-label-md tracking-widest text-on-surface-variant">
        {label.toUpperCase()}
      </dt>
      <dd className="mt-2 text-headline-xl">{value}</dd>
      {hint && (
        <dd className="mt-1 text-body-sm text-on-surface-variant">{hint}</dd>
      )}
    </div>
  );
}

export default StatTile;
