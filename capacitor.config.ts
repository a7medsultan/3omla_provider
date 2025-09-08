import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.beex.app",
  appName: "BeEx",
  bundledWebRuntime: false,
  webDir: "dist",
  server: {
    allowNavigation: ["http://213.199.44.152:8080"],
    cleartext: true, // Allows HTTP traffic
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
