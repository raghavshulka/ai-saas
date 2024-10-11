import { ImageIcon, Wand2 } from "lucide-react"

export type SocialFormat = keyof typeof socialFormats

export interface Feature {
  id: string
  name: string
  icon: React.ElementType
}

export const socialFormats = {
  "Instagram Square (1:1)": { width: 1080, height: 1080, aspectRatio: "1:1" },
  "Instagram Portrait (4:5)": { width: 1080, height: 1350, aspectRatio: "4:5" },
  "Instagram Landscape (1.91:1)": { width: 1080, height: 566, aspectRatio: "1.91:1" },
  "Instagram Story (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Twitter Post (16:9)": { width: 1200, height: 675, aspectRatio: "16:9" },
  "Twitter Header (3:1)": { width: 1500, height: 500, aspectRatio: "3:1" },
  "Twitter Profile (1:1)": { width: 400, height: 400, aspectRatio: "1:1" },
  "YouTube Thumbnail (16:9)": { width: 1280, height: 720, aspectRatio: "16:9" },
  "YouTube Channel Cover (16:9)": { width: 2560, height: 1440, aspectRatio: "16:9" },
  "TikTok Video (9:16)": { width: 1080, height: 1920, aspectRatio: "9:16" },
  "Facebook Post (1.91:1)": { width: 1200, height: 628, aspectRatio: "1.91:1" },
  "Facebook Cover (205:78)": { width: 820, height: 312, aspectRatio: "205:78" },
  "Facebook Profile (1:1)": { width: 170, height: 170, aspectRatio: "1:1" },
  "Facebook Event Cover (16:9)": { width: 1920, height: 1080, aspectRatio: "16:9" },
  "LinkedIn Post (1.91:1)": { width: 1200, height: 627, aspectRatio: "1.91:1" },
  "LinkedIn Cover (4:1)": { width: 1584, height: 396, aspectRatio: "4:1" },
  "LinkedIn Profile (1:1)": { width: 400, height: 400, aspectRatio: "1:1" },
  "Pinterest Pin (2:3)": { width: 1000, height: 1500, aspectRatio: "2:3" },
}

export const features: Feature[] = [
  { id: "base", name: "Original Image", icon: ImageIcon },
  { id: "Generative fill", name: "AI Crop Fill", icon: Wand2 },
  { id: "generativeBackground", name: "Generative Background", icon: Wand2 },
  { id: "Remove  Background", name: "Remove Background", icon: Wand2 },
  { id: "enhance", name: "AI Enhance", icon: Wand2 },
  { id: "generativeReplace", name: "Generative Replace", icon: Wand2 },
  { id: "upscale", name: "Upscale", icon: Wand2 },
  { id: "generativeRestore", name: "Generative Restore", icon: Wand2 },
  { id: "generative Remove", name: "Generative Remove", icon: Wand2 },
]

export interface SocialFormatData {
  width: number
  height: number
  aspectRatio: string
}

export interface ImageEditorState {
  uploadedImage: string | null
  selectedFormat: SocialFormat
  isUploading: boolean
  isTransforming: boolean
  activeFeature: Feature['id']
  backgroundPrompt: string
  removePrompt: string
  replaceFrom: string
  replaceTo: string
}