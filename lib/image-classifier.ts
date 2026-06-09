export type ImageClassification = {
  labels: string[];
  confidence: number;
};

export async function classifyImage(_imageUrl: string): Promise<ImageClassification> {
  // Replace this with Google Vision, Azure Computer Vision, AWS Rekognition, or a CLIP embedding service.
  return {
    labels: ["unclassified"],
    confidence: 0,
  };
}
