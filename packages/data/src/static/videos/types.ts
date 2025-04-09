/**
 * Represents a training video resource that can be used
 * for user education and compliance training.
 */
export interface TrainingVideo {
	/** Unique identifier for the video */
	id: string;
	/** Title of the training video */
	title: string;
	/** Detailed description of the video content */
	description: string;
	/** YouTube video identifier for embedding */
	youtubeId: string;
	/** Full URL to access the video */
	url: string;
}
