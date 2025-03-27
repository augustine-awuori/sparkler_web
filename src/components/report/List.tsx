import { useEffect, useState } from "react";
import styled from "styled-components";

import Card, { Report } from "./Card";
import LoadingIndicator from "../LoadingIndicator";
import service from "../../services/reports";

export default function List() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const init = async () => {
      if (error) setError("");

      setLoading(true);
      const { data, ok, problem } = await service.getReports();
      setLoading(false);

      if (ok) {
        const sortedReports = (data as Report[]).sort((a, b) =>
          a.seen === b.seen ? 0 : a.seen ? 1 : -1
        );
        setReports(sortedReports);
      } else setError(problem || "Error fetching reports");
    };

    init();
  }, []);

  if (loading) return <LoadingIndicator />;

  return (
    <Container>
      {error && <Error>{error}</Error>}
      {reports.map((report) => (
        <Card key={report._id} {...report} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  padding: 1rem 0 0;
`;

const Error = styled.h2`
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  margin: 1rem 0 0.5rem;
  line-height: 1.2;
`;
