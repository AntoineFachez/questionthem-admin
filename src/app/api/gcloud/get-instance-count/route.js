import { NextResponse } from "next/server";
import { MetricServiceClient } from "@google-cloud/monitoring";

// Initialize the Monitoring client
const monitoringClient = new MetricServiceClient();

export async function GET(req) {
  // Get the service name from a query parameter, e.g., /api/get-instance-count?service=sse-server
  const { searchParams } = new URL(req.url);
  const serviceName = searchParams.get("service");

  if (!serviceName) {
    return NextResponse.json(
      { error: "Service name is required." },
      { status: 400 }
    );
  }

  const projectId = process.env.GCP_PROJECT_ID;

  // Set the time interval to the last 5 minutes to get the most recent data point.
  const now = Date.now();
  const startTime = new Date(now - 5 * 60 * 1000).toISOString();
  const endTime = new Date(now).toISOString();

  try {
    const [timeSeries] = await monitoringClient.listTimeSeries({
      name: `projects/${projectId}`,
      // Filter for the specific metric and the specific Cloud Run service
      filter: `metric.type = "run.googleapis.com/container/instance_count" AND resource.labels.service_name = "${serviceName}"`,
      interval: {
        startTime: {
          seconds: Math.floor(new Date(startTime).getTime() / 1000),
        },
        endTime: { seconds: Math.floor(new Date(endTime).getTime() / 1000) },
      },
      // We are looking at a point in time, so aggregation isn't complex
      aggregation: {
        alignmentPeriod: { seconds: 60 },
        perSeriesAligner: "ALIGN_MAX",
      },
    });

    let currentInstanceCount = 0;
    // The API returns an array of time series data. We need to find the latest point.
    if (timeSeries.length > 0 && timeSeries[0].points.length > 0) {
      // The most recent point is the first in the array
      currentInstanceCount = timeSeries[0].points[0].value.int64Value;
    }

    return NextResponse.json({
      serviceName,
      currentInstanceCount,
    });
  } catch (error) {
    console.error("Error fetching instance count:", error);
    return NextResponse.json(
      { error: "Failed to fetch instance count." },
      { status: 500 }
    );
  }
}
