"use client";
// import Image from "./components/Image";
import Image from "./components/ImageGrid";
import Head from "./components/Head";
import CustomSlider from "./components/CustomSlider";
import { Header } from "./components/Header";
import Generate1 from "./components/Genrate1";
import Generate2 from "./components/Genrate2";
import Pricing from "./components/Pricing";
import PricingComponent from "./components/Pricing";
export default function Home() {
  return (
    <div className="">
      {/* <Sign/> */}
      {/* <Image/> */}
      <Header />
      <CustomSlider />
      <Generate1 />
      <Generate2 />
      <Image />
      <PricingComponent />
    </div>
  );
}
