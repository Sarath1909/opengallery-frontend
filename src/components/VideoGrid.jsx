import VideoCard from "./VideoCard";

export default function VideoGrid({ videos }) {
  return (
    <main className="p-4 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </main>
  );
}
