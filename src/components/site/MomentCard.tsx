interface Props {
  category?: string;
  title: string;
  date: string;
  gradient: string;
}
export function MomentCard({ category, title, date, gradient }: Props) {
  return (
    <div className="group hover-lift animate-scale-in relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft">
      <div className={`absolute inset-0 ${gradient}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" />
      {category && (
        <span className="absolute left-3 top-3 rounded-md bg-lime px-2 py-1 text-[10px] font-extrabold tracking-wider text-navy">
          {category}
        </span>
      )}
      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="text-base font-extrabold">{title}</p>
        <p className="text-xs text-white/80">📅 {date}</p>
      </div>
    </div>
  );
}
