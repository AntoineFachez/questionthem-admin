// app/api/gcloud/manage-scaling-instances/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { adminAuth } from "../../../../lib/firebase/firebase-admin";
import { ServicesClient } from "@google-cloud/run";

const runClient = new ServicesClient();

export async function POST(req) {
  try {
    // --- 1. Security: Verify User is an Admin ---
    // 👇 FIX #1: Added 'await' to the headers() call
    const authorization = (await headers()).get("Authorization");
    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const idToken = authorization.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (decodedToken.isAdmin !== true) {
      return NextResponse.json(
        { error: "Forbidden: User is not an admin." },
        { status: 403 }
      );
    }

    // --- 2. Input Validation ---
    const { minInstances, maxInstances, serviceName } = await req.json();
    if (
      typeof minInstances !== "number" ||
      typeof maxInstances !== "number" ||
      !serviceName
    ) {
      return NextResponse.json(
        { error: "Invalid input provided." },
        { status: 400 }
      );
    }
    if (minInstances < 0 || maxInstances < minInstances) {
      return NextResponse.json(
        { error: "Instance counts are invalid." },
        { status: 400 }
      );
    }

    // --- 3. Call the Cloud Run Admin API ---
    const fullServiceName = `projects/${process.env.GCP_PROJECT_ID}/locations/europe-west1/services/${serviceName}`;

    // 👇 FIX #2: First, get the current service configuration
    const [currentService] = await runClient.getService({
      name: fullServiceName,
    });

    // Now, create the patch by merging the current config with your changes
    const servicePatch = {
      ...currentService, // Start with all existing settings
      template: {
        ...currentService.template, // Keep existing template settings (like containers)
        scaling: {
          // Only override the scaling part
          minInstanceCount: minInstances,
          maxInstanceCount: maxInstances,
        },
      },
    };

    console.log(
      `Updating service ${serviceName} with min=${minInstances}, max=${maxInstances}`
    );

    const [operation] = await runClient.updateService({
      service: servicePatch,
    });
    await operation.promise();

    // --- 4. Return Success Response ---
    return NextResponse.json({
      message: `Successfully updated ${serviceName}. Min instances: ${minInstances}, Max instances: ${maxInstances}.`,
    });
  } catch (error) {
    console.error("Error updating Cloud Run service:", error);
    if (error.code === "auth/id-token-expired") {
      return NextResponse.json(
        { error: "Unauthorized: Token expired" },
        { status: 401 }
      );
    }
    // Provide the specific error from GCP if available
    const errorMessage = error.details || "An internal server error occurred.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
