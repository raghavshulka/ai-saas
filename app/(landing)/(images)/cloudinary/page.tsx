'use client'

import React, { useState, useEffect, useRef } from "react"
import { CldImage } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Image as ImageIcon, Wand2 } from "lucide-react"
import { SocialFormat, Feature, socialFormats, features } from "./imagcomp"

export default function ImageEditor() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedFormat, setSelectedFormat] = useState<SocialFormat>("Instagram Square (1:1)")
  const [isUploading, setIsUploading] = useState(false)
  const [isTransforming, setIsTransforming] = useState(false)
  const [activeFeature, setActiveFeature] = useState<Feature["id"]>("base")
  const [backgroundPrompt, setBackgroundPrompt] = useState<string>("")
  const [removePrompt, setRemovePrompt] = useState<string>("")
  const [replaceFrom, setReplaceFrom] = useState<string>("")
  const [replaceTo, setReplaceTo] = useState<string>("")
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (uploadedImage) {
      setIsTransforming(true)
    }
  }, [selectedFormat, uploadedImage, activeFeature, backgroundPrompt, removePrompt, replaceFrom, replaceTo])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/imageUpload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Failed to upload image")

      const data = await response.json()
      setUploadedImage(data.publicId)
    } catch (error) {
      console.error(error)
      alert("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownload = () => {
    if (!imageRef.current) return

    fetch(imageRef.current.src)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${selectedFormat.replace(/\s+/g, "_").toLowerCase()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
  }

  const renderImage = () => {
    if (!uploadedImage) return null

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
    }

    switch (activeFeature) {
      case "Generative fill":
        return <CldImage {...props} fillBackground crop="fill" />
      case "Remove  Background":
        return <CldImage {...props} removeBackground />
      case "generativeBackground":
        return <CldImage {...props} replaceBackground={backgroundPrompt} />
      case "enhance":
        return <CldImage {...props} restore />
      case "generativeReplace":
        return <CldImage {...props} replace={[replaceFrom, replaceTo]} />
      case "generative Remove":
        return <CldImage {...props} remove={removePrompt} />
      case "upscale":
        return <CldImage {...props} crop="fill" />
      case "generativeRestore":
        return <CldImage src={uploadedImage} width="960" height="600" crop="fill" restore sizes="100vw" alt="" />
      default:
        return <CldImage {...props} crop="fill" />
    }
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen ">
      <div className="w-full lg:w-80 bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold mb-8 text-primary">Image Creator</h1>
        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="edit" disabled={!uploadedImage}>
              Edit
            </TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>Upload Image</CardTitle>
                <CardDescription>Choose an image to upload and transform.</CardDescription>
              </CardHeader>
              <CardContent>
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload or drag and drop</span>
                  </div>
                  <Input id="image-upload" type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                </Label>
                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Edit Image</CardTitle>
                <CardDescription>Choose a format and apply transformations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Social Format</Label>
                  <Select value={selectedFormat} onValueChange={(value) => setSelectedFormat(value as SocialFormat)}>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(socialFormats).map((format) => (
                        <SelectItem key={format} value={format}>
                          {format}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Features</Label>
                  <ScrollArea className="h-[200px] rounded-md border p-2">
                    {features.map((feature) => (
                      <Button
                        key={feature.id}
                        variant={activeFeature === feature.id ? "default" : "outline"}
                        className="w-full justify-start mb-2"
                        onClick={() => setActiveFeature(feature.id)}
                      >
                        <feature.icon className="mr-2 h-4 w-4" />
                        {feature.name}
                      </Button>
                    ))}
                  </ScrollArea>
                </div>
                {activeFeature === "generativeBackground" && (
                  <div className="space-y-2">
                    <Label htmlFor="bg-prompt">Background Prompt</Label>
                    <Input
                      id="bg-prompt"
                      placeholder="Describe the background"
                      value={backgroundPrompt}
                      onChange={(e) => setBackgroundPrompt(e.target.value)}
                    />
                  </div>
                )}
                {activeFeature === "generative Remove" && (
                  <div className="space-y-2">
                    <Label htmlFor="remove-prompt">Remove Prompt</Label>
                    <Input
                      id="remove-prompt"
                      placeholder="Describe what to remove"
                      value={removePrompt}
                      onChange={(e) => setRemovePrompt(e.target.value)}
                    />
                  </div>
                )}
                {activeFeature === "generativeReplace" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="replace-from">Replace From</Label>
                      <Input
                        id="replace-from"
                        placeholder="Describe what to replace"
                        value={replaceFrom}
                        onChange={(e) => setReplaceFrom(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="replace-to">Replace To</Label>
                      <Input
                        id="replace-to"
                        placeholder="Describe the replacement"
                        value={replaceTo}
                        onChange={(e) => setReplaceTo(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex-1 p-6">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Image Preview</CardTitle>
            <CardDescription>Your transformed image will appear here.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-[calc(100%-100px)]">
            {uploadedImage ? (
              <div className="relative max-w-full max-h-full">
                {isTransforming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
                <div className="flex justify-center">{renderImage()}</div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">Upload an image to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      {uploadedImage && (
        <div className="fixed bottom-6 right-6">
          <Button onClick={handleDownload} className="shadow-lg">
            Download for {selectedFormat}
          </Button>
        </div>
      )}
    </div>
  )
}