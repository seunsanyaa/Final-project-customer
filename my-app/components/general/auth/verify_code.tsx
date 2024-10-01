
import { useRouter } from "next/router";
import { OTPForm } from "./form/otp";

export default function VerifyComponent() {
const router = useRouter()



  return (
    <div className="flex basis-1/2 flex-col px-20 pt-24">
      <svg
        width="52"
        height="51"
        viewBox="0 0 52 51"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_3635_6865)">
          <rect x="0.5" width="51" height="51" rx="25.5" fill="#0588F0" />
          <path
            d="M18.98 25.5879L-3.88818 71.3044"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M1.24427 25.5918L-32.6504 42.5538"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.15943 25.5918L-32.6504 52.1508"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M24.8887 25.5879L24.8491 71.3044"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M42.6245 25.5879L82.4545 52.1911"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M48.5337 25.5879L82.4487 42.5749"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M30.8008 25.5879L53.5901 71.3044"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.0637 25.5879L-32.6328 71.3044"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M36.7183 25.5879L82.3366 71.3044"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 31.8235H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 27.6516H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 28.4973H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 29.4622H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 26.1985H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 26.8899H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 33.3001H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 30.5637H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 25.5891H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 35.0325H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 37.0989H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 39.6184H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 42.7415H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M82.458 46.7258H-32.6504"
            stroke="#8EC8F6"
            stroke-width="0.306374"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_3635_6865">
            <rect x="0.5" width="51" height="51" rx="25.5" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <h2 className="paragraph-color pt-8 text-2xl font-semibold">
              Verify your email address
            </h2>
            <p className="paragraph-muted pb-4 text-base font-normal">
              We’ve sent a code to {router.query.email}.
            </p>
            
     <OTPForm/>
      

  
    </div>
  );
}
