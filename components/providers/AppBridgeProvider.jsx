const AppBridgeProvider = ({ children }) => {
  if (typeof window !== "undefined") {
    const shop = window?.shopify?.config?.shop;

    if (!shop) {
      return <h1>Hello, from Zahid Hasan Mozumder!</h1>;
    }
  }

  return <>{children}</>;
};

export default AppBridgeProvider;
