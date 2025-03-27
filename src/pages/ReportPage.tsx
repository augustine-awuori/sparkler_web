import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Added useNavigate
import styled from "styled-components";
import { toast } from "react-toastify";
import { Gallery } from "react-activity-feed";
import { FaArrowLeft } from "react-icons/fa"; // Added for back icon

import { Report } from "../components/report/Card";
import LoadingIndicator from "../components/LoadingIndicator";
import service from "../services/reports";

export default function ReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const navigate = useNavigate(); // For back navigation
  const [loading, setLoading] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [report, setReport] = useState<Report | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!reportId) {
        toast.error("No report ID provided");
        return;
      }

      setLoadingReport(true);
      const { data, ok, problem } = await service.getReport(reportId);
      setLoadingReport(false);

      if (ok) {
        const result = data as Report;
        setReport(result);
        setSeen(result.seen);
      } else toast.error(problem || "Error getting report");
    };

    init();
  }, [reportId]);

  const handleMarkAsSeen = async () => {
    if (!reportId || report?.seen) return;

    setSeen(true);
    setLoading(true);
    const { ok, problem } = await service.markReportAsSeen(reportId);
    setLoading(false);

    if (ok) {
      setReport((prev) => (prev ? { ...prev, seen: true } : null));
      toast.success("Report marked as seen");
    } else {
      setSeen(false);
      toast.error(problem || "Error marking report as seen");
    }
  };

  if (loadingReport || !report) return <LoadingIndicator />;

  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </BackButton>
        <HeaderTitle>Report Details</HeaderTitle>
      </Header>
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
        <MarkSeenButton onClick={handleMarkAsSeen} disabled={seen || loading}>
          {seen ? "Marked as Seen" : "Mark as Seen"}
        </MarkSeenButton>
      </ButtonWrapper>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  color: var(--text-color); /* #fff */
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color); /* #38444d */
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: var(--text-color); /* #fff */
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;

  &:hover {
    color: var(--primary-hover-color); /* #1a91da */
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem; /* 20px */
  font-weight: 700;
  color: var(--text-color); /* #fff */
`;

const ContentWrapper = styled.div`
  max-width: 600px;
  margin: 1rem auto 2rem; /* Adjusted top margin for spacing below header */
  padding: 0 1rem; /* Adjusted padding */
`;

const Title = styled.h1`
  font-size: 1.5rem; /* 24px */
  font-weight: 800;
  color: var(--text-color); /* #fff */
  margin-bottom: 1rem;
  line-height: 1.3;
  word-wrap: break-word;
`;

const Description = styled.p`
  font-size: 1rem; /* 16px */
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
