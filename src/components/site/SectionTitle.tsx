interface Props {
  eyebrow: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}
export function SectionTitle({ eyebrow, title, action, className = "" }: Props) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${className}`}>
      <div>
        <p className="mb-2 text-xs font-bold tracking-[0.25em] text-lime">{eyebrow}</p>
        <h2 className="text-3xl font-extrabold italic text-navy md:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
