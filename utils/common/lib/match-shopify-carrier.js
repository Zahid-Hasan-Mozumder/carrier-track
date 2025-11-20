import { AvailableExternalCarriers } from "../enums/available-external-carriers.js";
import { ShopifySupportedCarriers } from "../enums/shopify-supported-carriers.js";

const matchShopifyCarrier = (shopifyCarrier) => {
  switch (shopifyCarrier) {
    case ShopifySupportedCarriers.AMAZON_LOGISTICS:
      return AvailableExternalCarriers.AMAZON;
    default:
      return null;
  }
};

export default matchShopifyCarrier;
