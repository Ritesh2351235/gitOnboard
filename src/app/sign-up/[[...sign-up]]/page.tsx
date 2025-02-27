import { SignUp } from '@clerk/nextjs'
import { BackgroundBeams } from '@/components/ui/background-beams';

export default function Page() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-neutral-950 antialiased">
      {/* Background beams with increased z-index */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>

      {/* Main content container */}
      <div className="relative z-10 w-full max-w-md px-4 text-center">
        {/* Logo and text section */}
        <div className="mb-8 text-center">
          <h1 className="bg-gradient-to-b from-neutral-200 to-neutral-600 bg-clip-text text-4xl font-bold text-transparent sm:text-5xl md:text-7xl">
            gitOnboard
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm text-neutral-500">
            Empowering open-source contributions with AI-powered solutions
          </p>
        </div>

        {/* SignIn wrapper with custom styling */}
        <div className="relative mx-auto mt-8 max-w-md">
          <div className="backdrop-blur-sm">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-neutral-950/50 backdrop-blur-sm border border-neutral-800",
                  headerTitle: "text-neutral-200 text-lg font-bold",
                  headerSubtitle: "text-neutral-400",
                  socialButtonsBlockButton: "border-neutral-800 hover:bg-neutral-900",
                  socialButtonsBlockButtonText: "text-neutral-200",
                },
                layout: {
                  socialButtonsPlacement: "bottom",
                  showOptionalFields: false,
                },
              }}
              afterSignInUrl="/dashboard"
              signInUrl="/sign-in"
              path="/sign-up"
              routing="path"
            />
          </div>
        </div>
      </div>
    </div>
  );
}