import { useEffect, useState } from "react";
import { useStreamContext } from "react-activity-feed";
import { useParams } from "react-router-dom";
import { Activity } from "getstream";
import { toast } from "react-toastify";

import Header from "../Header";
import LoadingIndicator from "../LoadingIndicator";
import SparkleContent from "./SparkleContent";
import sparklesService from "../../services/sparkles";

export default function ThreadContent() {
  const [activity, setActivity] = useState<Activity>();
  const { client } = useStreamContext();
  const { id } = useParams();

  useEffect(() => {
    const fetchSparkle = async () => {
      if (!id || activity) return;

      const res = await sparklesService.getSparkles([id]);
      res.ok
        ? setActivity((res.data as Activity[])[0])
        : toast.error("Error fetching this sparkle");
    };

    fetchSparkle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!client || !activity) return <LoadingIndicator />;

  return (
    <div>
      <Header />
      <SparkleContent activity={activity} />
    </div>
  );
}
