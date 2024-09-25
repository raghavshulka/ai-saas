import { Header } from "../components/Header"
import CustomSlider from "../components/CustomSlider"
import Generate1 from "../components/Genrate1"
import Generate2 from "../components/Genrate2"
import ImageGallery from "../components/ImageGrid"
import PricingComponent from "../components/Pricing"

const Home = () => {
  return (
    <div className="bg-[#0d0d23] text-white">
      <Header />
      <div className="bg-gradient-to-br from-[#0d0d23] to-[#0e0e3f] py-12">
        <CustomSlider />
        <Generate1 />
        <Generate2 />
        <ImageGallery />
        <PricingComponent />
      </div>
    </div>
  )
}

export default Home