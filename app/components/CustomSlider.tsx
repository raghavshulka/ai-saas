"use client"
import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface EditingOption {
  name: string
  image: string
  video: string
  beforeImage: string
  afterImage: string
}

const editingOptions: EditingOption[] = [
  {
    name: "Landscape Color Grade",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    video:
      "https://player.vimeo.com/external/292609059.sd.mp4?s=9db44466db5a394c669a8c6a5235703a8f86e606&profile_id=164&oauth2_token_id=57447761",
    beforeImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80&sat=-100",
  },
  {
    name: "Animals Retouch",
    image:
      "https://images.unsplash.com/photo-1456926631375-92c8ce872def?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    video:
      "https://player.vimeo.com/external/421538207.sd.mp4?s=cd93456790d222f4e94dfe79cd3a1ff9e0d87998&profile_id=164&oauth2_token_id=57447761",
    beforeImage:
      "https://images.unsplash.com/photo-1456926631375-92c8ce872def?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1456926631375-92c8ce872def?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80&sat=100&con=120",
  },
  {
    name: "Portrait",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    video:
      "https://player.vimeo.com/external/371839760.sd.mp4?s=3d2a462f320d0d9f92fb5bbb126d8301c46fe1c3&profile_id=164&oauth2_token_id=57447761",
    beforeImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80&sat=50&con=110&bright=10",
  },
  {
    name: "Remove Objects",
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60",
    video:
      "https://player.vimeo.com/external/421538210.sd.mp4?s=03eff591d238b0c6c580a56d0f4a71b90c67b462&profile_id=164&oauth2_token_id=57447761",
    beforeImage:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
    afterImage:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80&blend=000000&blend-mode=color",
  },
]

interface CustomButtonProps {
  children: React.ReactNode
  isSelected: boolean
  onClick: () => void
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  isSelected,
  onClick,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`w-full h-24 md:h-auto p-0 overflow-hidden rounded-lg transition-colors duration-300 ${
      isSelected ? "ring-2 ring-purple-500" : "hover:bg-gray-800"
    }`}
  >
    {children}
  </motion.button>
)

const Component: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<EditingOption>(
    editingOptions[0]
  )
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false)

  useEffect(() => {
    setIsVideoPlaying(true)
    const timer = setTimeout(() => setIsVideoPlaying(false))
    return () => clearTimeout(timer)
  }, [selectedOption])

  return (
    <div className="min-h-screen pt-44 pb-44 flex items-center justify-center">
      <div className="w-full md:max-w-4xl max-w-sm md:aspect-video aspect-square md:rounded-lg overflow-hidden flex flex-col md:flex-row border border-gray-700">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-black p-2 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto border-r border-gray-700">
          {editingOptions.map((option) => (
            <CustomButton
              key={option.name}
              isSelected={selectedOption.name === option.name}
              onClick={() => setSelectedOption(option)}
            >
              <div className="w-full h-full relative">
                <img
                  src={option.image}
                  alt={option.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-2">
                  <span className="text-white text-xs">{option.name}</span>
                </div>
              </div>
            </CustomButton>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex">
            {/* "Before" image or video */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence>
                {isVideoPlaying ? (
                  <motion.video
                    key="video"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={selectedOption.video}
                    autoPlay
                    muted
                    loop
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <motion.img
                    key="image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    src={selectedOption.beforeImage}
                    alt="Before"
                    className="object-cover w-full h-full"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* "After" image */}
            <div
              className="flex-1 overflow-hidden"
            >
              <img
                src={selectedOption.afterImage}
                alt="After"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Component
