import { updateShopifyFulfillmentStatus } from "@/utils/common/graphql/shopify/fulfillment-status-update";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const trackingNumber = body.detail.trackingId;
    const carrier = body.source;
    const status = body.detail.status;
    await updateShopifyFulfillmentStatus(carrier, trackingNumber, status);
    return res.status(200).json({ message: "POST request processed" });
  }
  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
