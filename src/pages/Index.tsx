import { useEffect, useState } from "react";
import AuthForm from "@/components/auth/AuthForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/layout/Header";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [verificationResults, setVerificationResults] = useState<any[]>([]);
  const [currentStatement, setCurrentStatement] = useState<string>("");
  const [profile, setProfile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set the document title
    document.title = "BUNKr - Verify Statements";

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    setProfile(data);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${session?.user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: filePath })
        .eq("id", session?.user.id);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
      
      fetchProfile(session?.user.id);
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

  const handleUpdateUsername = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username })
        .eq("id", session?.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Username updated successfully",
      });
      
      fetchProfile(session?.user.id);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleVerify = (statement: string, results: any[]) => {
    setCurrentStatement(statement);
    setVerificationResults(results);
  };

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full flex justify-center mb-8">
          <img 
            src="/lovable-uploads/bbbcc199-7eed-436a-864f-91dc9f0a1df4.png" 
            alt="BUNKr Logo" 
            className="h-12 md:h-16"
          />
        </div>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header
          profile={profile}
          session={session}
          onUpdateUsername={handleUpdateUsername}
          onAvatarUpload={handleAvatarUpload}
          uploading={uploading}
        />
        <MainContent
          verificationResults={verificationResults}
          currentStatement={currentStatement}
          onVerify={handleVerify}
        />
      </div>
    </div>
  );
};

export default Index;