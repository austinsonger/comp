import imageBase64 from "./assets/image.base64";
// Import the function directly instead of through integrations
import { fetch } from "./src";

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
  name: "GCP",
  id: "gcp",
  active: true,
  logo: imageBase64(),
  short_description:
    "Connect your GCP account to Comp AI to automate evidence collection for cloud resources",
  description:
    "Integrating with Google Cloud Platform allows you to automate evidence collection. This compliance analysis tool enables organizations to more quickly articulate their compliance posture and also generate supporting evidence artifacts",
  images: [imageBase64()],
  settings: [
    {
      id: "organization_id",
      label: "GCP organization ID",
      description: "The organization ID of your GCP account",
      type: "text",
      required: true,
      value: "",
    },
    {
      id: "service_account_key",
      label: "GCP service account key",
      description: "JSON key for a service account with security center access",
      type: "text",
      required: true,
      value: "",
    }
  ],
  category: "Cloud",
	fetch: fetch
};

export default config;