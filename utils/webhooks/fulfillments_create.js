// To create a new webhook, create a new `.js` folder in /utils/webhooks/ and use the project snippet
// `createwebhook` to generate webhook boilerplate

/**
 * @typedef { import("@/_developer/types/2025-04/webhooks.js").FULFILLMENTS_CREATE} FulfillmentsCreate
 */

import prisma from "../prisma.js";
import clientProvider from "../clientProvider.js";

const fulfillmentsCreateHandler = async (
  topic,
  shop,
  webhookRequestBody,
  webhookId,
  apiVersion
) => {
  try {
    /** @type {FulfillmentsCreate} */
    const webhookBody = JSON.parse(webhookRequestBody);

    const trackingCompany = webhookBody.tracking_company;
    const fulfillmentId = webhookBody.id;

    if (trackingCompany === "Amazon Logistics") {
      await prisma.$transaction(async (tx) => {
        // Fetch the store
        const store = await prisma.stores.findFirst({
          where: { shop: shop },
        });

        // Create or update carrier in database
        const carrier = await tx.carriers.upsert({
          where: { carrierName: webhookBody.tracking_company },
          update: { carrierName: webhookBody.tracking_company },
          create: { carrierName: webhookBody.tracking_company },
        });

        // Create fulfillment in database
        const fulfillment = await tx.fulfillments.create({
          data: {
            fulfillmentId: String(webhookBody.id),
            orderId: String(webhookBody.order_id),
            trackingNumber: webhookBody.tracking_number,
            trackingUrl: webhookBody.tracking_url,
            status: "IN_TRANSIT",
            carrierId: carrier.id,
            storeId: store.id,
          },
        });

        // Create fulfillment line items in database
        await Promise.all(
          webhookBody.line_items.map(async (lineItem) => {
            return tx.fulfillmentLineItems.create({
              data: {
                productId: String(lineItem.product_id),
                title: lineItem.title,
                variantId: String(lineItem.variant_id),
                variantTitle: lineItem.variant_title ?? undefined,
                sku: lineItem.sku ?? undefined,
                quantity: lineItem.quantity,
                grams: lineItem.grams,
                price: lineItem.price,
                totalDiscount: lineItem.total_discount,
                fulfillmentId: fulfillment.id,
              },
            });
          })
        );
      });

      // Use offline admin client for webhooks (no req/res in handlers)
      const { client } = await clientProvider.offline.graphqlClient({ shop });
      const response = await client.request(
        `
          mutation fulfillmentEventCreate($fulfillmentEvent: FulfillmentEventInput!) {
            fulfillmentEventCreate(fulfillmentEvent: $fulfillmentEvent) {
              fulfillmentEvent {
                id
                status
                message
                happenedAt
              }
              userErrors {
                field
                message
              }
            }
          }
        `,
        {
          variables: {
            fulfillmentEvent: {
              fulfillmentId: `gid://shopify/Fulfillment/${fulfillmentId}`,
              status: "IN_TRANSIT", // ["IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "ATTEMPTED_DELIVERY", "FAILURE"]
              message: "Package is in transit",
              happenedAt: new Date().toISOString(),
            },
          },
        }
      );
    }
  } catch (e) {
    console.error(e);
  }
};

export default fulfillmentsCreateHandler;
