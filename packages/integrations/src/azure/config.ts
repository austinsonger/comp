import imageBase64 from "./assets/image.base64";
import { getIntegrationHandler } from "../factory";

// Get the handler from the factory
const azureHandler = getIntegrationHandler("azure");

// Type the export directly with inline annotation
const config: {
	name: string;
	id: string;
	active: boolean;
	logo: unknown;
	short_description: string;
	description: string;
	images: unknown[];
	settings: {
		id: string;
		label: string;
		description: string;
		type: string;
		required: boolean;
		value: string;
	}[];
	category: string;
	fetch: any;
} = {
  name: "Azure",
  id: "azure",
  active: true,
  logo: imageBase64(),
  short_description:
    "Connect your Azure account to Comp AI to automate evidence collection for cloud resources",
  description:
    "Integrating with Azure allows you to automate evidence collection. This compliance analysis tool enables organizations to more quickly articulate their compliance posture and also generate supporting evidence artifacts",
  images: [imageBase64()],
  settings: [
    {
      id: "AZURE_CLIENT_ID",
      label: "AZURE client ID",
      description: "The client ID for your AZURE account",
      type: "text",
      required: true,
      value: "",
    },
    {
      id: "AZURE_TENANT_ID",
      label: "AZURE tenant ID",
      description: "The tenant ID for your AZURE account",
      type: "text",
      required: true,
      value: "",
    },
    {
      id: "AZURE_CLIENT_SECRET",
      label: "AZURE client secret",
      description: "The client secret for your AZURE account",
      type: "text",
      required: true,
      value: "",
    },
    {
      id: "AZURE_SUBSCRIPTION_ID",
      label: "AZURE subscription ID",
      description: "The subscription ID for your AZURE account",
      type: "text",
      required: true,
      value: "",
    }
  ],
  category: "Cloud",
  // Use the fetch method from the handler
  fetch: azureHandler?.fetch
};

export default config;