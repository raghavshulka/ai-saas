// Generate2.tsx
export default function AIImageGeneratorLanding() {
  function Cmp({ style }: { style: string }) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div
          className={`max-w-7xl mx-auto flex flex-col items-center justify-between   lg:${style}`}
        >
          {/* Text Section */}
          <div className="lg:w-1/2 mb-8 lg:mb-0 text-center lg:text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-blue-400">GENERATIVE AI</span>
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-4xl font-bold mb-6">
              AI Image Generator Magic!
            </h2>
            <p className="text-gray-300 mb-8 text-sm md:text-base lg:text-base">
              Elevate your creations with the revolutionary Text to Image AI
              generator, revolutionizing the way you convert simple text into
              visually captivating artwork. Unleash your imagination and craft
              breathtaking, AI-generated masterpieces that are bound to
              captivate and inspire your audience.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Test Image Generator
            </button>
          </div>

          {/* Image Section */}
          <div className="lg:w-1/3 flex justify-center lg:justify-end space-x-4">
            {/* First Image */}
            <div className="w-1/3 transform -rotate-6">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
                alt="AI generated stylized portrait"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
            {/* Second Image */}
            <div className="w-1/3 transform rotate-3 translate-y-4">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
                alt="AI generated cartoon fox character"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
            {/* Third Image */}
            <div className="w-1/3 transform rotate-20 -translate-y-8">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60"
                alt="AI generated fantastical owl creature"
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Cmp style="flex-row-reverse" />
      <Cmp style="flex-row" />
    </>
  );
}