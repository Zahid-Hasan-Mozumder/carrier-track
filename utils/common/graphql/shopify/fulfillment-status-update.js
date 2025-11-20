import prisma from "@/utils/prisma.js";
import clientProvider from "@/utils/clientProvider.js";
import matchAmazonShopifyStatus from "@/utils/common/lib/match-amazon-shopify-status.js";
import { AvailableExternalCarriers } from "../../enums/available-external-carriers.js";

export const updateShopifyFulfillmentStatus = async (
  carrier,
  trackingNumber,
  status
) => {
  let shopifyStatus = null;
  if (carrier == AvailableExternalCarriers.AMAZON) {
    shopifyStatus = matchAmazonShopifyStatus(status);
    if (!shopifyStatus) {
      console.log("No matching status found");
      return;
    }
  }
  const fulfillment = await prisma.fulfillments.findFirst({
    where: {
      trackingNumber,
      carrier: { carrierName: carrier },
    },
    include: { store: true },
  });
  const { client } = await clientProvider.offline.graphqlClient({
    shop: fulfillment.store.shop,
  });
  await client.request(
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
          fulfillmentId: `gid://shopify/Fulfillment/${fulfillment.fulfillmentId}`,
          status: shopifyStatus, // ["IN_TRANSIT", "OUT_FOR_DELIVERY", "DELIVERED", "ATTEMPTED_DELIVERY", "FAILURE"]
          message: `Package current status is ${shopifyStatus.toLowerCase()}`,
          happenedAt: new Date().toISOString(),
        },
      },
    }
  );
};
