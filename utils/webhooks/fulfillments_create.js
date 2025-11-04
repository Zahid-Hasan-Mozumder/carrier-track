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

    console.log("webhookBody", webhookBody);

    // Use offline admin client for webhooks (no req/res in handlers)
    const { client } = await clientProvider.offline.graphqlClient({ shop });
    const fulfillmentId = webhookBody.id;
    console.log("fulfillmentId", fulfillmentId);
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
            status: "IN_TRANSIT",
            message: "Package is now in transit",
            happenedAt: new Date().toISOString(),
          },
        },
      }
    );
    console.log("response", response);
  } catch (e) {
    console.error(e);
  }
};

export default fulfillmentsCreateHandler;
