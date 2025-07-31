export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen matrix-bg matrix-section">
      {/* Animated Matrix Grid Background */}
      
      {/* Green Gradient Cloud Effect (from homepage hero) */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 blur-3xl pointer-events-none z-10"></div>
      
      {/* Floating matrix elements */}
      <div className="fixed inset-0 pointer-events-none z-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-primary rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-primary rounded-full opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-primary rounded-full opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-1/5 w-1 h-1 bg-primary rounded-full opacity-45 animate-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-primary rounded-full opacity-35 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>
      
      <div className="relative z-30">
        {children}
      </div>
    </div>
  )
} 