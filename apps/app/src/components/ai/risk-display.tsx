import { Card, CardContent, CardHeader, CardTitle } from "@comp/ui/card";
import { Badge } from "@comp/ui/badge";

interface Risk {
	id: string;
	title: string;
	description: string;
	owner: {
		name: string;
	};
}

interface RiskDisplayProps {
	risks: Risk[];
}

export function RiskDisplay({ risks }: RiskDisplayProps) {
	if (!risks?.length) {
		return (
			<div className="text-sm text-muted-foreground">
				No risks found for this organization.
			</div>
		);
	}

	return (
		<div className="grid gap-4">
			{risks.map((risk) => (
				<Card key={risk.id}>
					<CardHeader>
						<CardTitle className="text-base flex items-center justify-between">
							<span>{risk.title}</span>
							<Badge variant="secondary">{risk.owner.name}</Badge>
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">{risk.description}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
