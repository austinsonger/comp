import imageBase64 from "./assets/image.base64";
import { getIntegrationHandler } from "../factory";

// Get the handler from the factory
const awsHandler = getIntegrationHandler("aws");

// Type the export directly with inline annotation
const config: {
	name: string;
	id: string;
	active: boolean;
	logo: string; // base64 image string
	short_description: string;
	description: string;
	images: string[]; // array of base64 image strings
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
	name: "AWS",
	id: "aws",
	active: true,
	logo: imageBase64(),
	short_description: "Connect your AWS account to Comp AI to automate evidence collection for cloud resources",
	description: "Integrating with AWS allows you to automate evidence collection. This compliance analysis tool enables organizations to more quickly articulate their compliance posture and also generate supporting evidence artifacts",
	images: [imageBase64()],
	settings: [
		{
			id: "region",
			label: "AWS region",
			description: "The region of your AWS account",
			type: "text",
			required: true,
			value: "",
		},
		{
			id: "access_key_id",
			label: "AWS access key ID",
			description: "The API access key ID for your AWS account",
			type: "text",
			required: true,
			value: "",
		},
		{
			id: "secret_access_key",
			label: "AWS secret access key",
			description: "The API secret access key for your AWS account",
			type: "text",
			required: true,
			value: "",
		}
	],
	category: "Cloud",
	// Use the fetch method from the handler
	fetch: awsHandler?.fetch
};

export default config;
