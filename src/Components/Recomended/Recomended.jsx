import React, { useEffect, useState } from "react";
import "./Recomended.css";
import { API_KEY, value_converter } from "../../data";
import { Link } from "react-router-dom";

const Recomended = ({ categoryId }) => {
  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!categoryId) {
      console.warn("Category ID is missing. Cannot fetch data.");
      return;
    }

    const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching from API:", relatedVideo_url);
      const res = await fetch(relatedVideo_url);
      const data = await res.json();

      console.log("API Response:", data);

      if (data.items && data.items.length > 0) {
        setApiData(data.items);
      } else {
        console.warn("No videos found in API response.");
        setApiData([]);
      }
    } catch (error) {
      console.error("Error fetching recommended videos:", error);
      setError("Failed to load videos. Please try again.");
      setApiData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]); // Now it refetches data when categoryId changes

  return (
    <div className="recomended">
      {loading && <p>Loading recommendations...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && apiData.length === 0 && <p>No videos found.</p>}
      {apiData.map((item) => (
        <Link
          to={`/video/${item.snippet.categoryId}/${item.id}`}
          key={item.id}
          className="side-video-list"
        >
          <img src={item.snippet.thumbnails.medium.url} alt="Video Thumbnail" />
          <div className="vid-info">
            <h4>{item.snippet.title}</h4>
            <p>{item.snippet.channelTitle}</p>
            <p>{value_converter(item.statistics.viewCount)}</p>{" "}
            {/* Fixed here */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Recomended;
