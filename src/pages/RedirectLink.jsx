import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/use-ftech";
import { getLongUrl } from "../db/apiUrls";
import { useEffect } from "react";
import { storeClicks } from "../db/apiClicks";
import { BarLoader } from "react-spinners";

const RedirectLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data related to the URL
  const { loading, data, fn } = useFetch(getLongUrl, id);

  // Store clicks after fetching URL data
  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url
  });

  useEffect(() => {
    fn(); // Trigger fetch for the URL data when component mounts
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats(); // Store click stats once URL data is available
    }
  }, [loading]);

  useEffect(() => {
    if (!loading && !loadingStats && data?.original_url) {
      // Use navigate for React Router-friendly redirection
      navigate(data.original_url, { replace: true });
    }
  }, [loading, loadingStats, data, navigate]);

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color="#36d7b7" />
        <br />
        Redirecting...
      </>
    );
  }

  return null;
};

export default RedirectLink;
