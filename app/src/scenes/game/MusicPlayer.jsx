import React, { useEffect, useState } from "react";

export function Music({ YTurl, setLoading }) {
  const [volume, setVolume] = useState(localStorage.getItem("volume") || 20);
  if (!YTurl) return null;

  useEffect(() => {
    // little hack to prevent the iframe from appearing in the browser history
    const ifr = document.getElementById("ytplayer");
    ifr.contentWindow.location.replace(
      `https://yewtu.be/embed/${YTurl}?local=true&iv_load_policy=3&autoplay=1&continue=0&listen=true&quality=medium&related_videos=false&comments=false&loop=0&volume=${volume}`,
    );
  }, [YTurl, volume]);

  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        min="0"
        max="100"
        defaultValue={volume}
        onMouseUp={(e) => {
          setVolume(parseInt(e.target.value));
          localStorage.setItem("volume", e.target.value);
        }}
        className="w-56 mt-10"
      />
      <div className="text-white">Attention, changer le volume remet la musique au début</div>
      <iframe className="hidden" id="ytplayer" name="youtube-player" onLoad={() => setLoading(false)} title="YouTube video player" allow="autoplay" />
    </div>
  );
}
