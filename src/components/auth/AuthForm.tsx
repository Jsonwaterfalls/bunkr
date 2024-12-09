import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">{isSignUp ? "Create Account" : "Sign In"}</h2>
      </div>
      
      {isSignUp ? <SignUpForm /> : <SignInForm />}
      
      <div className="text-center">
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-blue-500 hover:underline"
        >
          {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;