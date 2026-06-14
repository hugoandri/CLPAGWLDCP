import { cn } from "@/lib/utils";

interface DisclaimerBoxProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

/** Aviso destacado (análisis informativo, no consejo de apuestas). */
export default function DisclaimerBox({
  children,
  title = "Aviso",
  className,
}: DisclaimerBoxProps) {
  return (
    <div
      role="note"
      className={cn(
        "flex gap-3 rounded-xl border border-gold/40 bg-gold/[0.08] p-4 text-sm dark:border-gold/30 dark:bg-gold/[0.06]",
        className,
      )}
    >
      <span aria-hidden className="mt-0.5 text-lg leading-none">
        ⚠️
      </span>
      <div>
        <p className="font-semibold text-navy dark:text-slate-100">{title}</p>
        <p className="mt-0.5 text-slate-600 dark:text-slate-300">{children}</p>
      </div>
    </div>
  );
}
