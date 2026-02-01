import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <BackgroundGradient />
      {children}
    </div>
  );
}
