import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import { Gallery } from "react-activity-feed";

import LoadingIndicator from "../components/LoadingIndicator";
import service from "../services/reports";
import { Report } from "../components/report/Card";

export default function ReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!reportId) {
        toast.error("No report ID provided");
        return;
      }

      setLoading(true);
      const { data, ok, problem } = await service.getReport(reportId);
      setLoading(false);

      if (ok) {
        setReport(data as Report);
      } else {
        toast.error(problem || "Error getting report");
      }
    };

    init();
  }, [reportId]);

  const handleMarkAsSeen = async () => {
    if (!reportId || report?.seen) return;

    setLoading(true);
    const { ok, problem } = await service.markReportAsSeen(reportId);
    setLoading(false);

    if (ok) {
      setReport((prev) => (prev ? { ...prev, seen: true } : null));
      toast.success("Report marked as seen");
    } else {
      toast.error(problem || "Error marking report as seen");
    }
  };

  if (loading || !report) return <LoadingIndicator />;

  return (
    <PageWrapper>
      <ContentWrapper>
        <Title>{report.title}</Title>
        <Description>{report.description}</Description>
        {report.images.length > 0 && (
          <Gallery
            images={report.images}
            style={{ border: "none", borderRadius: 15 }}
          />
        )}
        <Status seen={report.seen}>{report.seen ? "Seen" : "Unseen"}</Status>
      </ContentWrapper>
      <ButtonWrapper>
        <MarkSeenButton
          onClick={handleMarkAsSeen}
          disabled={report.seen || loading}
        >
          {report.seen ? "Marked as Seen" : "Mark as Seen"}
        </MarkSeenButton>
      </ButtonWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 1rem;
  color: var(--text-color); /* #fff */
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto 2rem; /* Extra bottom margin for spacing before button */
`;

const Title = styled.h1`
  font-size: 1.5rem; /* 24px, larger for prominence */
  font-weight: 800;
  color: var(--text-color); /* #fff */
  margin-bottom: 1rem;
  line-height: 1.3;
  word-wrap: break-word;
`;

const Description = styled.p`
  font-size: 1rem; /* 16px, slightly larger for readability */
  color: var(--text-color); /* #fff */
  margin-bottom: 1.5rem;
  line-height: 1.5;
  word-wrap: break-word;
`;

const Status = styled.div<{ seen: boolean }>`
  font-size: 0.875rem; /* 14px */
  color: ${({ seen }) =>
    seen
      ? "var(--gray-color)"
      : "var(--primary-color)"}; /* #888888 or #1da1f2 */
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const ButtonWrapper = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const MarkSeenButton = styled.button`
  background-color: var(--primary-color); /* #1da1f2 */
  color: var(--text-color); /* #fff */
  padding: 0.75rem 1.5rem;
  border-radius: 9999px; /* X.com pill shape */
  border: none;
  font-size: 0.9375rem;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--primary-hover-color); /* #1a91da */
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
