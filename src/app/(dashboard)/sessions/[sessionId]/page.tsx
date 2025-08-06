import { SessionDetailView } from "@/features/sessions/views/session-detail-view";

interface SessionDetailPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function SessionDetailPage({ params }: SessionDetailPageProps) {
  const { sessionId } = await params;
  return <SessionDetailView sessionId={sessionId} />;
}