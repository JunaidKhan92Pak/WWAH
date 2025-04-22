// scripts/build-meta-index.js
// import { createMetaIndex } from "../lib/utils/meta-index.tsx";
import "dotenv/config";
import { createMetaIndex } from "@/lib/utils/meta-index";

async function run() {
  try {
    console.log("Starting meta-index build process...");
    const result = await createMetaIndex();
    console.log("Meta-index build complete:", result);
    process.exit(0);
  } catch (error) {
    console.error("Error building meta-index:", error);
    process.exit(1);
  }
}

run();
//command for running script
//  npx tsx scripts/build-meta-index.ts