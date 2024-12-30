import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfilePosts } from "@/components/profile/ProfilePosts";

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Redirect if id is undefined or invalid UUID
  useEffect(() => {
    if (!id || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      navigate('/');
      toast({
        title: "Invalid Profile",
        description: "This profile does not exist.",
        variant: "destructive",
      });
    }
  }, [id, navigate, toast]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
    });
  }, []);

  const { data: profile, isError: profileError } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setBio(data.bio || "");
      return data;
    },
    enabled: !!id,
  });

  const { data: posts } = useQuery({
    queryKey: ["user-posts", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          verification_results (*)
        `)
        .eq("user_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update({ bio })
        .eq("id", currentUser.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${currentUser?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", currentUser?.id);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (profileError) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Profile not found</p>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === id;

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        isEditing={isEditing}
        bio={bio}
        setBio={setBio}
        handleAvatarUpload={handleAvatarUpload}
        updateProfileMutation={updateProfileMutation}
        setIsEditing={setIsEditing}
        uploading={uploading}
      />
      <ProfilePosts posts={posts || []} />
    </div>
  );
};

export default Profile;