type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export default function GlassCard({ children, className = "", ...props }: Props) {
  return (
    <div className={`rounded-lg border border-line bg-panel shadow-glow backdrop-blur-xl ${className}`} {...props}>
      {children}
    </div>
  );
}
