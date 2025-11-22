import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle, Gavel } from "lucide-react";

type Feature = {
  title: string;
  description: string;
};

type BrandInfoType = {
  title: string;
  description: string;
  features: Feature[];
};

const brandInfos: Record<string, BrandInfoType> = {
  loginInfo: {
    title: "Welcome Back!",
    description:
      "The modern online auction marketplace where buyers and sellers connect for unique items and great deals.",
    features: [
      {
        title: "Trusted Marketplace",
        description: "Safe and secure transactions",
      },
      { title: "Live Auctions", description: "Bid in real-time" },
    ],
  },
  registerInfo: {
    title: "Get Started!",
    description:
      "Start your journey in the world's most trusted online auction marketplace.",
    features: [
      {
        title: "Secure Transactions",
        description: "Your data and payments are protected",
      },
      {
        title: "Email Verification",
        description: "Verified accounts for trusted users",
      },
      { title: "24/7 Support", description: "We're here to help you succeed" },
    ],
  },
  forgotInfo: {
    title: "Password Recovery!",
    description:
      "Don't worry! It happens to the best of us. Follow the steps to recover your account.",
    features: [],
  },
};

const BrandInfo = ({ info }: { info: BrandInfoType }) => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold">{info.title}</h2>
        <p className="text-lg text-gray-300">{info.description}</p>
      </div>

      {info.features.length > 0 && (
        <div className="flex flex-col gap-4">
          {info.features.map((feat, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="size-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="size-6" />
              </div>

              <div>
                <p className="font-semibold">{feat.title}</p>
                <p className="text-sm text-gray-300">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const AuthBrandSide = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginRoute = location.pathname.startsWith("/login");
  const isRegisterRoute = location.pathname.startsWith("/register") || location.pathname.startsWith("/verify-email");

  const info = isLoginRoute
    ? brandInfos.loginInfo
    : isRegisterRoute
    ? brandInfos.registerInfo
    : brandInfos.forgotInfo;

  return (
    <div className="hidden relative lg:flex w-1/2 items-center justify-center bg-linear-to-br from-primary to-primary/80 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=1200&fit=crop"
          alt="Auction Background"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 text-white p-12">
        <div className="flex flex-col gap-8 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md">
          <button
            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="bg-white rounded-xl p-3">
              <Gavel className="size-10 text-black" />
            </div>
            <span className="text-4xl font-bold">Auctiva</span>
          </button>

          <BrandInfo info={info} />
        </div>
      </div>
    </div>
  );
};

export default AuthBrandSide;
