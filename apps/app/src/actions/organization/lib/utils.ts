import type {
  TemplateControl,
  TemplateEvidence,
  TemplatePolicy,
} from "@comp/data";
import { controls, evidence, frameworks, policies } from "@comp/data";
import { db } from "@comp/db";
import { FrameworkId, type PolicyStatus, RequirementId } from "@prisma/client";
import type { InputJsonValue } from "@prisma/client/runtime/library";
import { Prisma, type PrismaClient } from "@prisma/client";

/**
 * A type-safe wrapper for accessing policy templates by ID
 *
 * @param id - The ID of the policy to retrieve
 * @returns The policy template or undefined if not found
 */
export function getPolicyById(id: string): TemplatePolicy | undefined {
  // Use a type-safe approach to check if the key exists in the policies object
  return Object.entries(policies).find(([key]) => key === id)?.[1];
}

/**
 * A type-safe wrapper for accessing evidence templates by ID
 *
 * @param id - The ID of the evidence to retrieve
 * @returns The evidence template or undefined if not found
 */
export function getEvidenceById(id: string): TemplateEvidence | undefined {
  // Use a type-safe approach to check if the key exists in the evidence object
  return Object.entries(evidence).find(([key]) => key === id)?.[1];
}

/**
 * Identifies which controls are relevant to the selected frameworks.
 *
 * This function filters the control templates from the data package to find
 * only those that map to requirements from the selected frameworks. This ensures
 * we only create controls that are actually needed for the organization's
 * compliance program.
 *
 * @param frameworkIds - Array of framework IDs selected by the organization
 * @returns Array of control templates relevant to the selected frameworks
 */
export function getRelevantControls(
  frameworkIds: FrameworkId[]
): TemplateControl[] {
  return controls.filter((control) =>
    control.mappedRequirements.some((req) =>
      frameworkIds.includes(req.frameworkId)
    )
  );
}

/**
 * Creates framework instances for the organization.
 *
 * This function:
 * 1. Validates the organization and framework exist
 * 2. Creates a framework instance record linking the organization to the framework
 * 3. Creates control records for all controls required by the framework
 *
 * Framework instances represent which compliance frameworks an organization is
 * implementing, and what their status is with those frameworks.
 *
 * @param organizationId - ID of the organization
 * @param frameworkId - ID of the framework to create an instance for
 * @returns The created framework instance record
 */
export async function createFrameworkInstance(
  organizationId: string,
  frameworkId: FrameworkId,
  txClient?: Prisma.TransactionClient
) {
  const prisma: Prisma.TransactionClient | PrismaClient = txClient ?? db;
  // First verify the organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!organization) {
    console.error("Organization not found when creating framework", {
      organizationId,
      frameworkId,
    });
    throw new Error(`Organization with ID ${organizationId} not found`);
  }

  // Verify the framework exists
  const framework = frameworks[frameworkId as FrameworkId];

  if (!framework) {
    console.error("Framework not found when creating organization framework", {
      organizationId,
      frameworkId,
    });
    throw new Error(`Framework with ID ${frameworkId} not found`);
  }

  // Check if a framework instance already exists
  const existingFrameworkInstance = await prisma.frameworkInstance.findUnique({
    where: {
      organizationId_frameworkId: {
        organizationId,
        frameworkId: frameworkId as FrameworkId,
      },
    },
  });

  // Create or update the framework instance
  const frameworkInstance = existingFrameworkInstance
    ? await prisma.frameworkInstance.update({
        where: {
          id: existingFrameworkInstance.id,
        },
        data: {
          organizationId,
          frameworkId: frameworkId as FrameworkId,
        },
      })
    : await prisma.frameworkInstance.create({
        data: {
          organizationId,
          frameworkId: frameworkId as FrameworkId,
        },
      });

  console.info("Created/updated organization framework", {
    organizationId,
    frameworkId,
    frameworkInstanceId: frameworkInstance.id,
  });

  // Find all controls that apply to this specific framework
  const frameworkControls = controls.filter((control) =>
    control.mappedRequirements.some((req) => req.frameworkId === frameworkId)
  );

  // Prepare data for batch control creation
  const controlsToCreate = frameworkControls.map((control) => ({
    organizationId,
    name: control.name,
    description: control.description,
    // We connect frameworkInstances later or handle differently if createMany doesn't support relation connection easily
  }));

  // Batch create controls if there are any to create
  if (controlsToCreate.length > 0) {
    await prisma.control.createMany({
      data: controlsToCreate,
      skipDuplicates: true, // Assuming we want to skip if a control with the same unique constraint exists
    });

    // Fetch the controls we just created or found (based on name and orgId)
    // to get their IDs and connect them to the framework instance
    const createdOrFoundDbControls = await prisma.control.findMany({
      where: {
        organizationId,
        name: { in: frameworkControls.map((c: TemplateControl) => c.name) },
      },
      select: { id: true, name: true }, // Select only necessary fields
    });

    // Connect the controls to the framework instance
    if (createdOrFoundDbControls.length > 0) {
      await prisma.frameworkInstance.update({
        where: { id: frameworkInstance.id },
        data: {
          controls: {
            connect: createdOrFoundDbControls.map((c) => ({ id: c.id })),
          },
        },
      });
    }

    console.info(
      `Batch created/found ${createdOrFoundDbControls.length} controls for framework ${frameworkId}`
    );

    // Create requirement maps for the controls
    // Pass the fetched controls with IDs to createRequirementMaps
    await createRequirementMaps(
      { id: frameworkInstance.id, frameworkId },
      createdOrFoundDbControls, // Pass controls with IDs
      frameworkControls, // Pass original templates for mapping logic
      txClient // Pass the transaction client down
    );
  } else {
    console.info(`No new controls to create for framework ${frameworkId}`);
  }

  return frameworkInstance;
}

/**
 * Creates requirement map entries linking controls to their requirements.
 *
 * This function:
 * 1. Takes a framework instance and its controls
 * 2. Creates RequirementMap entries linking controls to their requirements
 * 3. Ensures proper tracking of compliance requirements
 *
 * RequirementMaps represent which specific requirements (e.g., SOC2 CC1.1)
 * are satisfied by each control in the organization's compliance program.
 *
 * @param frameworkInstance - The framework instance record
 * @param controls - Array of created control records (must include id and name)
 * @param templateControls - Array of control templates with requirement mappings
 * @returns The number of requirement maps created
 */
export async function createRequirementMaps(
  frameworkInstance: { id: string; frameworkId: FrameworkId },
  controls: { id: string; name: string }[],
  templateControls: TemplateControl[],
  txClient?: Prisma.TransactionClient
) {
  const prisma: Prisma.TransactionClient | PrismaClient = txClient ?? db;

  console.info("Creating requirement maps", {
    frameworkInstanceId: frameworkInstance.id,
    controlCount: controls.length,
  });

  // Create a map for efficient control lookup
  const controlMap = new Map(
    controls.map((control) => [control.name, control])
  );

  // Prepare data for batch requirement map creation
  const requirementMapsToCreate: {
    controlId: string;
    frameworkInstanceId: string;
    requirementId: RequirementId;
  }[] = [];

  // For each template control
  for (const templateControl of templateControls) {
    // Find the corresponding created control
    const control = controlMap.get(templateControl.name);
    if (!control) {
      console.warn(`Control not found for template: ${templateControl.name}`);
      continue;
    }

    // Get requirements for this framework
    const frameworkRequirements = templateControl.mappedRequirements.filter(
      (req) => req.frameworkId === frameworkInstance.frameworkId
    );

    // Create requirement maps
    for (const requirement of frameworkRequirements) {
      // Prepare data instead of creating immediately
      requirementMapsToCreate.push({
        controlId: control.id,
        frameworkInstanceId: frameworkInstance.id,
        requirementId:
          `${frameworkInstance.frameworkId}_${requirement.requirementId}` as RequirementId,
      });
    }
  }

  // Batch create requirement maps if there are any
  let requirementMapsCreatedCount = 0;
  if (requirementMapsToCreate.length > 0) {
    try {
      const result = await prisma.requirementMap.createMany({
        data: requirementMapsToCreate,
        skipDuplicates: true, // Skip if the mapping already exists
      });
      requirementMapsCreatedCount = result.count;
      console.info(
        `Batch created ${requirementMapsCreatedCount} requirement maps`
      );
    } catch (error) {
      console.error(
        `Error batch creating requirement maps for framework ${frameworkInstance.frameworkId}`,
        { error }
      );

      throw new Error("Failed to create requirement maps");
    }
  } else {
    console.info(
      `No new requirement maps to create for framework ${frameworkInstance.frameworkId}`
    );
  }

  return requirementMapsCreatedCount;
}

/**
 * Creates policy records for the organization based on control requirements.
 *
 * This function:
 * 1. Identifies all policies required by the relevant controls
 * 2. Creates policy records using templates from the data package
 * 3. Records which policies were created for later artifact linking
 *
 * Policies are core documents that define how an organization implements
 * their compliance requirements. They're referenced by controls to demonstrate
 * compliance with specific requirements.
 *
 * @param organizationId - ID of the organization
 * @param relevantControls - Array of controls relevant to the organization
 * @param userId - ID of the user creating the organization (becomes policy owner)
 * @returns Map of template policy IDs to created policy records
 */
export async function createOrganizationPolicies(
  organizationId: string,
  relevantControls: TemplateControl[],
  userId: string,
  txClient?: Prisma.TransactionClient
) {
  const prisma: Prisma.TransactionClient | PrismaClient = txClient ?? db;

  if (!organizationId) {
    throw new Error("Not authorized - no organization found");
  }

  // Extract all policy IDs required by the controls
  const policyIds = new Set<string>();
  for (const control of relevantControls) {
    for (const artifact of control.mappedArtifacts) {
      if (artifact.type === "policy") {
        policyIds.add(artifact.policyId);
      }
    }
  }

  if (policyIds.size === 0) {
    console.info("No policies required for the selected controls.");
    return new Map<string, any>(); // Return empty map if no policies needed
  }

  console.info("Preparing to create organization policies", {
    organizationId,
    policyCount: policyIds.size,
    policyIds: Array.from(policyIds),
  });

  // Find the member record for the user once
  const memberRecord = await prisma.member.findFirst({
    where: {
      organizationId,
      userId,
    },
    select: { id: true }, // Select only the ID
  });

  if (!memberRecord) {
    console.warn(
      `Member record not found for user: ${userId} in org ${organizationId}. Cannot assign policies.`
    );
  }

  const policiesToCreateData: Prisma.PolicyCreateManyInput[] = [];
  const policyTemplateMap = new Map<string, TemplatePolicy>();

  for (const policyId of policyIds) {
    const policyTemplate = getPolicyById(policyId);
    if (!policyTemplate) {
      console.warn(`Policy template not found: ${policyId}`);
      continue;
    }
    policyTemplateMap.set(policyId, policyTemplate); // Store template for later use

    policiesToCreateData.push({
      organizationId,
      name: policyTemplate.metadata.name,
      description: policyTemplate.metadata.description,
      status: "draft" as PolicyStatus,
      content: policyTemplate.content as InputJsonValue[],
      assigneeId: memberRecord?.id || null, // Use found member ID or null
      frequency: policyTemplate.metadata.frequency,
      department: policyTemplate.metadata.department,
    });
  }

  if (policiesToCreateData.length === 0) {
    console.info("No valid policy templates found to create policies.");
    return new Map<string, any>();
  }

  // Batch create policies
  try {
    await prisma.policy.createMany({
      data: policiesToCreateData,
      skipDuplicates: true, // Assuming name+orgId might be unique, or handle constraints appropriately
    });
    console.info(
      `Batch created ${policiesToCreateData.length} policies for org ${organizationId}`
    );
  } catch (error) {
    console.error(`Error batch creating policies for org ${organizationId}`, {
      error,
    });
    // Depending on requirements, might need to throw or handle differently
    throw new Error("Failed to create organization policies"); // Throw for now
  }

  // Fetch the created policies to return them with IDs
  // We need to map back using a unique identifier, e.g., name + organizationId
  const createdPolicyNames = policiesToCreateData.map(
    (p: Prisma.PolicyCreateManyInput) => p.name
  );
  const createdDbPolicies = await prisma.policy.findMany({
    where: {
      organizationId,
      name: { in: createdPolicyNames },
    },
  });

  // Create the final map to return, mapping templateId to the created policy record
  const createdPoliciesMap = new Map<string, any>();
  const dbPolicyMap = new Map(createdDbPolicies.map((p) => [p.name, p]));

  for (const [templateId, template] of policyTemplateMap.entries()) {
    const dbPolicy = dbPolicyMap.get(template.metadata.name);
    if (dbPolicy) {
      createdPoliciesMap.set(templateId, {
        ...dbPolicy,
        templateId: templateId, // Add templateId back for consistency if needed elsewhere
      });
    } else {
      console.warn(
        `Could not find created policy in DB for template: ${templateId} (Name: ${template.metadata.name})`
      );
    }
  }

  return createdPoliciesMap;
}

/**
 * Creates evidence records for the organization based on control requirements.
 *
 * This function:
 * 1. Identifies all evidence requirements from the relevant controls
 * 2. Creates evidence records using templates from the data package
 * 3. Records which evidence was created for later artifact linking
 *
 * Evidence represents the actual documentation, reports, logs, etc. that
 * organizations must collect to demonstrate compliance with their controls.
 *
 * @param organizationId - ID of the organization
 * @param relevantControls - Array of controls relevant to the organization
 * @param userId - ID of the user creating the organization (becomes evidence assignee)
 * @returns Map of template evidence IDs to created evidence records
 */
export async function createOrganizationEvidence(
  organizationId: string,
  relevantControls: TemplateControl[],
  userId: string,
  txClient?: Prisma.TransactionClient
) {
  const prisma: Prisma.TransactionClient | PrismaClient = txClient ?? db;

  if (!organizationId) {
    throw new Error("Not authorized - no organization found");
  }

  // Extract all evidence IDs required by the controls
  const evidenceIds = new Set<string>();
  for (const control of relevantControls) {
    for (const artifact of control.mappedArtifacts) {
      if (artifact.type === "evidence") {
        evidenceIds.add(artifact.evidenceId);
      }
    }
  }

  if (evidenceIds.size === 0) {
    console.info("No evidence required for the selected controls.");
    return new Map<string, any>(); // Return empty map if no evidence needed
  }

  console.info("Preparing to create evidence record instances", {
    organizationId,
    evidenceCount: evidenceIds.size,
    evidenceIds: Array.from(evidenceIds),
  });

  // Find the member record for the user once
  const memberRecord = await prisma.member.findFirst({
    where: {
      organizationId,
      userId,
      isActive: true, // Keep the isActive check if necessary
    },
    select: { id: true }, // Select only the ID
  });

  if (!memberRecord) {
    console.warn(
      `Active member record not found for user: ${userId} in org ${organizationId}. Cannot assign evidence.`
    );
    // Decide if we should throw, or proceed without an assignee
  }

  const evidenceToCreateData: Prisma.EvidenceCreateManyInput[] = [];
  const evidenceTemplateMap = new Map<string, TemplateEvidence>();

  for (const evidenceId of evidenceIds) {
    const evidenceTemplate = getEvidenceById(evidenceId);
    if (!evidenceTemplate) {
      console.warn(`Evidence template not found: ${evidenceId}`);
      continue;
    }
    evidenceTemplateMap.set(evidenceId, evidenceTemplate); // Store template for later use

    evidenceToCreateData.push({
      organizationId,
      name: evidenceTemplate.name,
      description: evidenceTemplate.description,
      frequency: evidenceTemplate.frequency,
      assigneeId: memberRecord?.id || null, // Use found member ID or null
      department: evidenceTemplate.department,
      // Defaults for array fields if createMany requires them
      additionalUrls: [],
      fileUrls: [],
    });
  }

  if (evidenceToCreateData.length === 0) {
    console.info(
      "No valid evidence templates found to create evidence records."
    );
    return new Map<string, any>();
  }

  // Batch create evidence records
  try {
    await prisma.evidence.createMany({
      data: evidenceToCreateData,
      skipDuplicates: true, // Assuming name+orgId might be unique
    });
    console.info(
      `Batch created ${evidenceToCreateData.length} evidence records for org ${organizationId}`
    );
  } catch (error) {
    console.error(
      `Error batch creating evidence records for org ${organizationId}`,
      { error }
    );
    throw new Error("Failed to create organization evidence");
  }

  // Fetch the created evidence records to return them with IDs
  const createdEvidenceNames = evidenceToCreateData.map(
    (e: Prisma.EvidenceCreateManyInput) => e.name
  );
  const createdDbEvidence = await prisma.evidence.findMany({
    where: {
      organizationId,
      name: { in: createdEvidenceNames },
    },
  });

  // Create the final map to return, mapping templateId to the created evidence record
  const createdEvidenceMap = new Map<string, any>();
  const dbEvidenceMap = new Map(createdDbEvidence.map((e) => [e.name, e]));

  for (const [templateId, template] of evidenceTemplateMap.entries()) {
    const dbEvidence = dbEvidenceMap.get(template.name);
    if (dbEvidence) {
      createdEvidenceMap.set(templateId, {
        ...dbEvidence,
        templateId: templateId, // Add templateId back for consistency
      });
    } else {
      console.warn(
        `Could not find created evidence in DB for template: ${templateId} (Name: ${template.name})`
      );
    }
  }

  return createdEvidenceMap;
}

/**
 * Creates artifacts that link controls to their policies and evidence.
 *
 * This function:
 * 1. Retrieves all created control records
 * 2. For each control, creates artifacts linking it to its required policies and evidence
 *
 * Artifacts are the connections between controls and the policies/evidence that
 * demonstrate compliance with those controls. They represent the actual implementation
 * of compliance requirements.
 *
 * @param organizationId - ID of the organization
 * @param frameworkInstanceIds - IDs of the created framework instances
 * @param relevantControls - Array of controls relevant to the organization
 * @param createdPolicies - Map of template policy IDs to created policy records
 * @param createdEvidence - Map of template evidence IDs to created evidence records
 * @returns Object with success status and artifact count
 */
export async function createControlArtifacts(
  organizationId: string,
  frameworkInstanceIds: string[],
  relevantControls: TemplateControl[],
  createdPolicies: Map<string, any>,
  createdEvidence: Map<string, any>,
  txClient?: Prisma.TransactionClient
) {
  const prisma: Prisma.TransactionClient | PrismaClient = txClient ?? db;

  if (!organizationId) {
    throw new Error("Not authorized - no organization found");
  }

  console.info("Creating organization control artifacts", {
    organizationId,
    frameworkInstanceIds,
    relevantControlsCount: relevantControls.length,
  });

  // Get all controls for this organization and framework instances
  const dbControls = await prisma.control.findMany({
    where: {
      organizationId,
      frameworkInstances: {
        some: {
          id: {
            in: frameworkInstanceIds,
          },
        },
      },
    },
  });

  // Create a mapping from control name to database control record for efficient lookup
  const controlMap = new Map<string, any>();
  for (const control of dbControls) {
    controlMap.set(control.name, control);
  }

  // Create artifacts for each control
  let artifactsCreated = 0;

  for (const control of relevantControls) {
    const dbControl = controlMap.get(control.name);

    if (!dbControl) {
      console.warn(
        `Control not found in database: ${control.name}, skipping artifact creation.`
      );
      continue;
    }

    // Create artifacts for each policy and evidence mapped to this control
    for (const artifact of control.mappedArtifacts) {
      try {
        if (artifact.type === "policy") {
          // Link control to a policy
          const policy = createdPolicies.get(artifact.policyId);

          if (!policy) {
            console.warn(
              `Policy not found for artifact: ${artifact.policyId} (Control: ${control.name}), skipping policy artifact.`
            );
            continue;
          }

          // Create the policy artifact
          await prisma.artifact.create({
            data: {
              type: "policy",
              policyId: policy.id,
              organizationId,
              controls: {
                connect: {
                  id: dbControl.id,
                },
              },
            },
          });

          artifactsCreated++;
        } else if (artifact.type === "evidence") {
          // Link control to evidence
          const evidenceRecord = createdEvidence.get(artifact.evidenceId);

          if (!evidenceRecord) {
            console.warn(
              `Evidence not found for artifact: ${artifact.evidenceId} (Control: ${control.name}), skipping evidence artifact.`
            );
            continue;
          }

          // Create the evidence artifact
          await prisma.artifact.create({
            data: {
              type: "evidence",
              evidenceId: evidenceRecord.id,
              organizationId,
              controls: {
                connect: {
                  id: dbControl.id,
                },
              },
            },
          });

          artifactsCreated++;
        }
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          console.warn(
            `Artifact link already exists for control ${control.name}, skipping creation.`
          );
        } else {
          console.error(`Error creating artifact for control ${control.name}`, {
            error,
            artifactDetails: artifact, // Log artifact details for debugging
          });
          throw new Error(
            `Failed to create artifact for control ${control.name}`
          );
        }
      }
    }
  }

  console.info(`Created/verified ${artifactsCreated} artifacts for controls`);

  return { success: true, artifactsCreated };
}
