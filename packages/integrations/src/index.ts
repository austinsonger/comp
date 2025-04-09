import Aws from "./aws/config";
import Deel from "./deel/config";
import Azure from "./azure/config";
import Gcp from "./gcp/config";

export const integrations = [Aws, Deel, Azure, Gcp];

// Export the integration factory
export { getIntegrationHandler, type IntegrationHandler } from "./factory";
export type {
	AWSCredentials,
	AzureCredentials,
	DecryptFunction,
	EncryptedData,
} from "./factory";
