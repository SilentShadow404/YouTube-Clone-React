import React, { useEffect, useState } from "react";
import "./PlayVideo.css";
import like from "../../assets/like.png";
import dislike from "../../assets/dislike.png";
import share from "../../assets/share.png";
import save from "../../assets/save.png";
import user_profile from "../../assets/user_profile.jpg";
import { API_KEY } from "../../data";
import { value_converter } from "../../data";
import moment from "moment";

const PlayVideo = ({ videoId }) => {
  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  // Function to fetch video details
  const fetchVideoData = async () => {
    const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;

    try {
      const res = await fetch(videoDetails_url);
      const data = await res.json();
      if (data.items?.length > 0) {
        setApiData(data.items[0]);
      }
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  // Function to fetch channel details and comments
  const fetchOtherData = async () => {
    if (!apiData?.snippet?.channelId) return;

    const channelData_url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=snippet%2Creplies&maxResults=50&videoId=${videoId}&key=${API_KEY}`;

    try {
      // Fetch channel data
      const res = await fetch(channelData_url);
      const data = await res.json();
      if (data.items?.length > 0) {
        setChannelData(data.items[0]);
      }

      // Fetch comments data
      const commentRes = await fetch(comment_url);
      const commentData = await commentRes.json();
      if (commentData.items) {
        setCommentData(commentData.items);
      }
    } catch (error) {
      console.error("Error fetching additional data:", error);
    }
  };

  // Fetch video data on mount
  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  // Fetch channel and comment data when video data is available
  useEffect(() => {
    fetchOtherData();
  }, [apiData?.snippet?.channelId]);

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3>

      <div className="play-video-info">
        <p>
          {apiData ? value_converter(apiData.statistics.viewCount) : "16K"}{" "}
          Views &bull;{" "}
          {apiData?.snippet?.publishedAt
            ? moment(apiData.snippet.publishedAt).fromNow()
            : "Some time ago"}
        </p>
        <div>
          <span>
            <img src={like} alt="" />
            {value_converter(apiData ? apiData.statistics.likeCount : 155)}
          </span>
          <span>
            <img src={dislike} alt="" />2
          </span>
          <span>
            <img src={share} alt="" />
            Share
          </span>
          <span>
            <img src={save} alt="" />
            Save
          </span>
        </div>
      </div>

      <hr />

      <div className="publisher">
        <img
          src={channelData?.snippet?.thumbnails?.default?.url || user_profile}
          alt=""
        />
        <div>
          <p>{apiData?.snippet?.channelTitle}</p>
          <span>
            {channelData?.statistics?.subscriberCount
              ? value_converter(channelData.statistics.subscriberCount)
              : "1M"}{" "}
            Subscribers
          </span>
        </div>
        <button>Subscribe</button>
      </div>

      <div className="vid-description">
        <p>Channel that makes learning Easy</p>
        <p>{apiData?.snippet?.description}</p>
        <p>
          Subscribe to Greatstack to watch more tutorials on web development
        </p>
        <hr />
        <h4>
          {value_converter(apiData ? apiData.statistics.commentCount : 155)}{" "}
          Comments
        </h4>

        {commentData.map((item, index) => (
          <div key={index} className="comment">
            <img
              src={
                item?.snippet?.topLevelComment?.snippet
                  ?.authorProfileImageUrl || user_profile
              }
              alt=""
            />
            <div>
              <h3>
                {item?.snippet?.topLevelComment?.snippet?.authorDisplayName}{" "}
                <span>
                  {moment(
                    item?.snippet?.topLevelComment?.snippet?.publishedAt
                  ).fromNow()}
                </span>
              </h3>
              <p>{item?.snippet?.topLevelComment?.snippet?.textDisplay}</p>
              <div className="comment-action">
                <img src={like} alt="" />
                <span>
                  {value_converter(
                    item?.snippet?.topLevelComment?.snippet?.likeCount
                  )}
                </span>
                <img src={dislike} alt="" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayVideo;
