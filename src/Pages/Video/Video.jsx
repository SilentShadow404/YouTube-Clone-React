import React from "react";
import "./Video.css";
import PlayVideo from "../../Components/PlayVideo/PlayVideo";
import Recomended from "../../Components/Recomended/Recomended";
import { useParams } from "react-router-dom";

function Video() {
  const { videoID, categoryID } = useParams();
  return (
    <div>
      <div className="play-container">
        <PlayVideo videoId={videoID} />
        <Recomended categoryId={categoryID} />
      </div>
    </div>
  );
}

export default Video;
