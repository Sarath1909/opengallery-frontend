export default function VideoCard({ video }) {
  return (
    <div className="cursor-pointer group">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="mt-3">
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <p className="text-sm text-neutral-400">{video.channel}</p>
        <p className="text-sm text-neutral-500">
          {video.views} • {video.time}
        </p>
      </div>
    </div>
  );
}
