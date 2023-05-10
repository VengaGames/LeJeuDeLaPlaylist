export function Music({ YTurl, setLoading }) {
  if (!YTurl) return null;

  return (
    <iframe
      className="hidden"
      onLoad={() => setLoading(false)}
      src={`https://yewtu.be/embed/${YTurl}?local=true&iv_load_policy=3&autoplay=1&continue=0&listen=true&quality=medium&related_videos=false&comments=false&loop=0&volume=20&controls=0`}
      title="YouTube video player"
      allow="autoplay"
    />
  );
}
