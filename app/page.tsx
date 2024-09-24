"use client";
import Generate1 from "./components/Genrate1";
import Image from "./components/Image";
import PricingComponent from "./components/Pricing";
import Generate2 from "./components/Genrate2";
import CustomSlider from "./components/CustomSlider";
import { Header } from "./components/Header";

export default function Home() {
  return (
    <div className="">
      {/* <Sign/> */}
      {/* <Image/> */}
      <Header />
      <CustomSlider />
      <Generate1 />
      <Generate2 />
      <PricingComponent />
    </div>
  );
}
