// Contratos de los proveedores de IA. Cada proveedor (Claude, un generador de
// imágenes, uno de video...) implementa una de estas interfaces, así se puede
// cambiar de proveedor sin tocar el resto de la app.
// Todas las respuestas incluyen el costo real en USD para medir el margen.

export type AspectRatio = "1:1" | "4:5" | "9:16" | "16:9";

export interface TextGenerationRequest {
  system?: string;
  prompt: string;
  imageUrls?: string[];
  maxTokens?: number;
}

export interface TextGenerationResult {
  text: string;
  model: string;
  costUsd: number;
}

export interface TextAIProvider {
  readonly name: string;
  generateText(request: TextGenerationRequest): Promise<TextGenerationResult>;
}

export interface ImageGenerationRequest {
  prompt: string;
  aspectRatio: AspectRatio;
  referenceImageUrls?: string[];
}

export interface ImageGenerationResult {
  image: Blob;
  model: string;
  costUsd: number;
}

export interface ImageAIProvider {
  readonly name: string;
  generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResult>;
}

export interface VideoGenerationRequest {
  script: string;
  durationSeconds: 8 | 15 | 30 | 60;
  aspectRatio: AspectRatio;
  referenceImageUrls?: string[];
  avatarId?: string;
  voiceId?: string;
}

// Los videos tardan: se inicia el trabajo y luego se consulta su estado.
export type VideoJobStatus =
  | { state: "processing" }
  | { state: "done"; videoUrl: string; costUsd: number }
  | { state: "failed"; error: string };

export interface VideoAIProvider {
  readonly name: string;
  startVideo(request: VideoGenerationRequest): Promise<{ jobId: string }>;
  getVideoStatus(jobId: string): Promise<VideoJobStatus>;
}
