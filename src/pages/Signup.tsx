import SignupForm from "@/components/auth/SignupForm";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-800">ARC Portal</h1>
          <p className="text-primary-600">Create your account</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}