interface PostContentProps {
  statement: string;
  referencePost?: {
    statement: string;
  };
  mediaUrl?: string | null;
  mediaType?: string | null;
}

export const PostContent = ({ statement, referencePost, mediaUrl, mediaType }: PostContentProps) => {
  return (
    <div className="space-y-4">
      {referencePost && (
        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="text-muted-foreground mb-2">Shared post:</p>
          <p>{referencePost.statement}</p>
        </div>
      )}
      <p className="text-lg">{statement}</p>
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