import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PostCard } from "@/components/PostCard";

interface ProfilePostsProps {
  posts: any[];
}

export const ProfilePosts = ({ posts }: ProfilePostsProps) => {
  return (
    <Tabs defaultValue="recent" className="w-full">
      <TabsList>
        <TabsTrigger value="recent">Recent Posts</TabsTrigger>
        <TabsTrigger value="popular">Popular Posts</TabsTrigger>
      </TabsList>
      <TabsContent value="recent" className="space-y-4">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {!posts?.length && (
          <p className="text-center text-muted-foreground py-8">
            No posts yet
          </p>
        )}
      </TabsContent>
      <TabsContent value="popular" className="space-y-4">
        <p className="text-center text-muted-foreground py-8">
          Coming soon...
        </p>
      </TabsContent>
    </Tabs>
  );
};