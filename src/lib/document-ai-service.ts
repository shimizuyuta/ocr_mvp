import { DocumentProcessorServiceClient } from "@google-cloud/documentai";
import { GoogleAuth } from "google-auth-library";

export class DocumentAIService {
  private client: DocumentProcessorServiceClient;

  constructor() {
    const credentials = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string,
    );
    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });

    this.client = new DocumentProcessorServiceClient({ auth });
  }

  async extractText(buffer: Buffer, mimeType: string): Promise<string> {
    const credentials = JSON.parse(
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON as string,
    );
    const name = `projects/${credentials.project_id}/locations/${process.env.DOC_AI_LOCATION}/processors/${process.env.DOC_AI_PROCESSOR_ID}`;

    const request = {
      name,
      rawDocument: {
        content: buffer.toString("base64"),
        mimeType,
      },
    };

    const [result] = await this.client.processDocument(request);
    const document = result.document;

    return document?.text || "";
  }
}
