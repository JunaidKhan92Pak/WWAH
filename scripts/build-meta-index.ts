// scripts/build-meta-index.js\
import "dotenv/config";

import { createMetaIndex, createUserIndex } from "../lib/utils/meta-index";

async function run() {
  try {
    console.log("Starting meta-index build process...");
    const result = await createMetaIndex();
    console.log("Meta-index build complete:", result);
    console.log("Starting user-index build process...");
    const userResult = await createUserIndex();
    console.log("User-index build complete:", userResult);
    process.exit(0);
  } catch (error) {
    console.error("Error building meta-index:", error);
    process.exit(1);
  }
}

run();
//command for running script
//  npx tsx scripts/build-meta-index.ts
// scripts/build-meta-index.js
// import { createMetaIndex, createUserIndex } from "../lib/utils/meta-index";
// import "dotenv/config";

// async function run() {
//   try {
//     console.log("Starting meta-index build process...");
//     const metaResult = await createMetaIndex();
//     console.log("Meta-index build complete:", metaResult);

//     // If you have a specific user ID to process
//    // Replace with actual userId or get from env
//     console.log("Starting user-index build process...");
//     const userResult = await createUserIndex();
//     console.log("User-index build complete:", userResult);

//     process.exit(0);
//   } catch (error) {
//     console.error("Error building indexes:", error);
//     process.exit(1);
//   }
// }

// run();
