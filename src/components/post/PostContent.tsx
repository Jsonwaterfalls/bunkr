interface PostContentProps {
  statement: string;
  referencePost?: {
    statement: string;
  };
}

export const PostContent = ({ statement, referencePost }: PostContentProps) => {
  return (
    <div className="space-y-4">
      {referencePost && (
        <div className="rounded-lg bg-muted p-4 text-sm">
          <p className="text-muted-foreground mb-2">Shared post:</p>
          <p>{referencePost.statement}</p>
        </div>
      )}
      <p className="text-lg">{statement}</p>
    </div>
  );
};