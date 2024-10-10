"use client";

import React, { useState, useEffect, useRef } from "react";
import { CldImage } from "next-cloudinary";

const socialFormats = {
  // Instagram
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Landscape (1.91:1)": {
    width: 1080,
    height: 566,
    aspectRatio: "1.91:1",
  },
  "Instagram Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },

  // Twitter (X)
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Twitter Profile (1:1)": { width: 400, height: 400, aspectRatio: "1:1" },

  // YouTube
  "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
  "YouTube Channel Cover (16:9)": {
    width: 2560,
    height: 1440,
    aspectRatio: "16:9",
  },

  // TikTok
  "TikTok Video (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },

  // Facebook
  "Facebook Post (1.91:1)": { width: 1200, height: 628, aspectRatio: "1.91:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  "Facebook Profile (1:1)": { width: 170, height: 170, aspectRatio: "1:1" },
  "Facebook Event Cover (16:9)": {
    width: 1920,
    height: 1080,
    aspectRatio: "16:9",
  },

  // LinkedIn
  "LinkedIn Post (1.91:1)": { width: 1200, height: 627, aspectRatio: "1.91:1" },
  "LinkedIn Cover (4:1)": { width: 1584, height: 396, aspectRatio: "4:1" },
  "LinkedIn Profile (1:1)": { width: 400, height: 400, aspectRatio: "1:1" },

  // Pinterest
  "Pinterest Pin (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
};

type SocialFormat = keyof typeof socialFormats;

const features = [
  { id: "base", name: "Original Image" },
  { id: "Generative fill", name: "Ai Crop Fill" },
  { id: "generativeBackground", name: "Generative Background" },
  { id: "enhance", name: "AI Enhance" },
  { id: "generativeReplace", name: "Generative Replace" },
  { id: "upscale", name: "Upscale" },
  { id: "generativeRestore", name: "Generative Restore" },
];

export default function SocialShare() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>(
    "Instagram Square (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string>("base");
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true);
    }
  }, [selectedFormat, uploadedImage, activeFeature]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/imageUpload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload image");

      const data = await response.json();
      setUploadedImage(data.publicId);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      });
  };

  const renderImage = () => {
    if (!uploadedImage) return null;

    const props = {
      width: socialFormats[selectedFormat].width,
      height: socialFormats[selectedFormat].height,
      src: uploadedImage,
      sizes: "100vw",
      alt: "transformed image",
      aspectRatio: socialFormats[selectedFormat].aspectRatio,
      gravity: "auto",
      ref: imageRef,
      onLoad: () => setIsTransforming(false),
    };

    switch (activeFeature) {
      case "Generative fill":
        return (
          <CldImage
            width={socialFormats[selectedFormat].width}
            height={socialFormats[selectedFormat].height}
            src={uploadedImage}
            sizes="100vw"
            fillBackground
            alt="transformed image"
            crop="fill"
            aspectRatio={socialFormats[selectedFormat].aspectRatio}
            gravity="auto"
            ref={imageRef}
            onLoad={() => setIsTransforming(false)}
          />
        );
      case "generativeBackground":
        return (
          <CldImage
            {...props}
            fillBackground={{ prompt: "a beautiful landscape" }}
          />
        );
      case "enhance":
        return (
          <CldImage {...props} enhance={{ mode: "beauty", strength: 50 }} />
        );
      case "generativeReplace":
        return <CldImage {...props} generativeReplace="prompt_replace_me" />;
      case "upscale":
        return <CldImage {...props} upscale={{ amount: 2 }} />;
      case "generativeRestore":
        return <CldImage {...props} generativeRestore="true" />;
      default:
        return (
          <CldImage
            width={socialFormats[selectedFormat].width}
            height={socialFormats[selectedFormat].height}
            src={uploadedImage}
            sizes="100vw"
            // fillBackground
            alt="transformed image"
            crop="fill"
            aspectRatio={socialFormats[selectedFormat].aspectRatio}
            gravity="auto"
            ref={imageRef}
            onLoad={() => setIsTransforming(false)}
          />
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-8">Image Creator</h1>
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Upload Image</h2>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: "45%" }}
                ></div>
              </div>
            )}
          </div>
          {uploadedImage && (
            <>
              <div>
                <h2 className="text-lg font-semibold mb-3">Social Format</h2>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format) => (
                    <option key={format} value={format}>
                      {format}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <h2 className="text-lg font-semibold mb-3">Features</h2>
                <div className="space-y-2">
                  {features.map((feature) => (
                    <button
                      key={feature.id}
                      className={`w-full p-2 rounded-md transition-colors ${
                        activeFeature === feature.id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                      onClick={() => setActiveFeature(feature.id)}
                    >
                      {feature.name}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {uploadedImage ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Image Preview</h2>
            <div className="relative">
              {isTransforming && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                  <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              <div className="flex justify-center">{renderImage()}</div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleDownload}
              >
                Download for {selectedFormat}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl text-gray-500">
              Upload an image to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
