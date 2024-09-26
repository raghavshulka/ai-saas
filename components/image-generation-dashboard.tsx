"use client";

import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Maximize2,
  Download,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GeneratedImage {
  url: string;
  metadata: string;
}

const models = [
  { value: "flux", label: "FLUX.1-schnell" },
  { value: "stable-diffusion", label: "Stable Diffusion" },
  { value: "dall-e", label: "DALL-E" },
];

export function ImageGenerationDashboard() {
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("Don't put hands");
  const [model, setModel] = useState("flux");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState("");
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const modelUrl =
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell";

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, models: modelUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "An error occurred");
      }

      const data = await response.json();
      const newImages: GeneratedImage[] = Array(6)
        .fill(null)
        .map((_, index) => ({
          url: `data:image/png;base64,${data.image}`,
          metadata: `Generated ${index + 1}: ${(index + 1) * 0.5}m ago`,
        }));
      setImages(newImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    setLoading(false);
  };

  const handleFullscreen = (imageUrl: string) => {
    setFullscreenImage(imageUrl);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "generated-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen bg-black text-gray-200 font-sans">
      <header className="p-4 sm:p-6 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white">
          AI Image Generator
        </h1>
      </header>
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 sm:p-6 gap-4 sm:gap-6">
        <Card className="w-full lg:w-1/3 bg-white/5 border-none backdrop-blur-2xl rounded-xl overflow-hidden shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <Tabs defaultValue="generate" className="h-full flex flex-col">
              <TabsList className="mb-4 sm:mb-6 bg-white/10 p-1 rounded-lg">
                <TabsTrigger
                  value="generate"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
                >
                  Generate
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
                >
                  History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="generate" className="flex-1 overflow-auto">
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-6"
                >
                  <div className="space-y-2">
                    <label
                      htmlFor="model"
                      className="text-sm font-medium text-gray-300"
                    >
                      Model
                    </label>
                    <Select value={model} onValueChange={setModel}>
                      <SelectTrigger className="w-full bg-white/10 border-none text-white">
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-none">
                        {models.map((m) => (
                          <SelectItem
                            key={m.value}
                            value={m.value}
                            className="text-gray-200"
                          >
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="prompt"
                      className="text-sm font-medium text-gray-300"
                    >
                      Prompt
                    </label>
                    <Textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="h-32 resize-none bg-white/10 border-none placeholder-gray-500 text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="negativePrompt"
                      className="text-sm font-medium text-gray-300"
                    >
                      Negative Prompt
                    </label>
                    <Input
                      id="negativePrompt"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="bg-white/10 border-none text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </form>
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="mt-4 sm:mt-6 border-red-600 bg-red-900/30 backdrop-blur-sm">
                        <CardContent className="p-4">
                          <p className="text-red-200">{error}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
              <TabsContent value="history" className="flex-1 overflow-hidden">
                <ScrollArea className="h-[calc(100vh-16rem)]">
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((image, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden bg-white/10 border-none backdrop-blur-md">
                          <CardHeader className="p-0 relative">
                            <img
                              src={image.url}
                              alt={`Generated ${index + 1}`}
                              className="w-full h-auto object-cover aspect-square"
                            />
                            <div className="absolute top-2 right-2 flex space-x-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleFullscreen(image.url)}
                              >
                                <Maximize2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => handleDownload(image.url)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="p-2">
                            <p className="text-xs text-gray-400">
                              {image.metadata}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="w-full lg:w-2/3 bg-white/5 border-none backdrop-blur-2xl rounded-xl overflow-hidden shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <ScrollArea className="h-[calc(100vh-10rem)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <AnimatePresence>
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden bg-white/10 border-none backdrop-blur-md hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
                        <CardHeader className="p-0 relative">
                          <img
                            src={image.url}
                            alt={`Generated ${index + 1}`}
                            className="w-full h-auto object-cover aspect-square"
                          />
                          <div className="absolute top-2 right-2 flex space-x-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleFullscreen(image.url)}
                            >
                              <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDownload(image.url)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-3">
                          <p className="text-xs text-gray-400">
                            {image.metadata}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              {images.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ImageIcon className="h-16 w-16 text-gray-600 mb-4" />
                  <p className="text-gray-400">
                    No images generated yet. Enter a prompt and click "Generate
                    Image" to start.
                  </p>
                </div>
              )}
              {loading && (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={handleCloseFullscreen}
        >
          <img
            src={fullscreenImage}
            alt="Fullscreen"
            className="max-w-full max-h-full object-contain"
          />
          <Button
            className="absolute top-4 right-4"
            onClick={handleCloseFullscreen}
          >
            Close
          </Button>
        </div>
      )}
    </div>
  );
}
