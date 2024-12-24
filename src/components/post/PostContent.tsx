interface PostContentProps {
  statement: string;
  referencePost?: {
    statement: string;
  };
  mediaUrl?: string | null;
  mediaType?: string | null;
  tags?: string[];
}

export const PostContent = ({ statement, referencePost, mediaUrl, mediaType, tags }: PostContentProps) => {
  return (
    <div className="space-y-4">
      {referencePost && (
        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="text-muted-foreground mb-2">Shared post:</p>
          <p className="text-foreground">{referencePost.statement}</p>
        </div>
      )}
      <p className="text-lg text-foreground font-medium">{statement}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span 
              key={tag} 
              className="text-sm text-primary bg-muted px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
      {mediaUrl && (
        <div className="rounded-lg overflow-hidden">
          {mediaType === 'image' ? (
            <img 
              src={mediaUrl} 
              alt="Post media" 
              className="w-full h-auto max-h-[500px] object-contain"
            />
          ) : mediaType === 'video' ? (
            <video 
              src={mediaUrl} 
              controls 
              className="w-full max-h-[500px]"
            >
              Your browser does not support the video tag.
            </video>
          ) : null}
        </div>
      )}
    </div>
  );
};