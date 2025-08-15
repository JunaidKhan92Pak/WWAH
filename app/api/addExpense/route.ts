// // app/api/expenses/route.ts - Fixed version
// import { connectToDatabase } from "@/lib/db";
// import Expense from "@/models/trackExpense";
// import { NextResponse } from "next/server";
// import { MongoClient } from "mongodb";
// import {
//   createExpense,
//   updateExpenseByFilter, // Use filter-based update instead
// } from "@/lib/databseHook";

// export async function POST(req: Request) {
//   try {
//     const data = await req.json();
//     console.log(data, "Data");

//     if (
//       !data ||
//       !data.country_name ||
//       !data.university_name ||
//       !data.lifestyles
//     ) {
//       return NextResponse.json(
//         {
//           message:
//             "Invalid input. 'country_name', 'university_name', and 'lifestyles' are required.",
//         },
//         { status: 400 }
//       );
//     }

//     await connectToDatabase();

//     // Get MongoDB client for database hooks
//     const client = new MongoClient(process.env.MONGODB_URI!);
//     await client.connect();

//     try {
//       const existingExpense = await Expense.findOne({
//         country_name: data.country_name,
//         university_name: data.university_name,
//       });

//       if (existingExpense) {
//         // Prepare update data with proper merging of lifestyles
//         const updateData = {
//           currency: data.currency || existingExpense.currency,
//           lifestyles: [
//             ...(existingExpense.lifestyles || []),
//             ...data.lifestyles,
//           ],
//         };

//         // Remove duplicates based on lifestyle type
//         const uniqueLifestyles = updateData.lifestyles.reduce(
//           (acc, current) => {
//             const existing = acc.find((item) => item.type === current.type);
//             if (!existing) {
//               acc.push(current);
//             } else {
//               // Update existing lifestyle with new data
//               Object.assign(existing, current);
//             }
//             return acc;
//           },
//           []
//         );

//         updateData.lifestyles = uniqueLifestyles;

//         // Use filter-based update instead of ID-based update
//         const filter = {
//           country_name: data.country_name,
//           university_name: data.university_name,
//         };

//         await updateExpenseByFilter(client, filter, updateData);

//         return NextResponse.json(
//           { message: "Expense details updated successfully." },
//           { status: 200 }
//         );
//       } else {
//         // Use database hooks for creation (this will trigger embedding creation)
//         const result = await createExpense(client, data);

//         return NextResponse.json(
//           {
//             message: "Expense details added successfully.",
//             id: result.insertedId,
//           },
//           { status: 201 }
//         );
//       }
//     } finally {
//       await client.close();
//     }
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json(
//       {
//         message: "Failed to process the request.",
//         error: (error as Error).message,
//       },
//       { status: 500 }
//     );
//   }
// }
// app/api/expenses/route.ts - Fixed version with TypeScript types
import { connectToDatabase } from "@/lib/db";
import Expense from "@/models/trackExpense";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { createExpense, updateExpenseByFilter } from "@/lib/databseHook";

// Define TypeScript interfaces
interface ExpenseRange {
  min: number;
  max: number;
}

interface Lifestyle {
  type: string;
  currency: string;
  internet: ExpenseRange;
  mobile: ExpenseRange;
  groceries: ExpenseRange;
  public_transport: ExpenseRange;
  rent: ExpenseRange;
  utilities: ExpenseRange;
  total_estimated_cost: ExpenseRange;
}

interface ExpenseData {
  country_name: string;
  university_name: string;
  currency?: string;
  lifestyles: Lifestyle[];
  // Add index signature to allow additional properties
  [key: string]: unknown;
}

interface ExistingExpense {
  country_name: string;
  university_name: string;
  currency: string;
  lifestyles: Lifestyle[];
}

export async function POST(req: Request) {
  try {
    const data: ExpenseData = await req.json();
    console.log(data, "Data");

    if (
      !data ||
      !data.country_name ||
      !data.university_name ||
      !data.lifestyles
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid input. 'country_name', 'university_name', and 'lifestyles' are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get MongoDB client for database hooks
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();

    try {
      const existingExpense: ExistingExpense | null = await Expense.findOne({
        country_name: data.country_name,
        university_name: data.university_name,
      });

      if (existingExpense) {
        // Prepare update data with proper merging of lifestyles
        const updateData = {
          currency: data.currency || existingExpense.currency,
          lifestyles: [
            ...(existingExpense.lifestyles || []),
            ...data.lifestyles,
          ],
        };

        // Remove duplicates based on lifestyle type with proper typing
        const uniqueLifestyles = updateData.lifestyles.reduce(
          (acc: Lifestyle[], current: Lifestyle) => {
            const existing = acc.find(
              (item: Lifestyle) => item.type === current.type
            );
            if (!existing) {
              acc.push(current);
            } else {
              // Update existing lifestyle with new data
              Object.assign(existing, current);
            }
            return acc;
          },
          [] as Lifestyle[]
        );

        updateData.lifestyles = uniqueLifestyles;

        // Use filter-based update instead of ID-based update
        const filter = {
          country_name: data.country_name,
          university_name: data.university_name,
        };

        await updateExpenseByFilter(client, filter, updateData);

        return NextResponse.json(
          { message: "Expense details updated successfully." },
          { status: 200 }
        );
      } else {
        // Use database hooks for creation (this will trigger embedding creation)
        // Option 1: Type assertion (quick fix)
        const result = await createExpense(
          client,
          data as Record<string, unknown>
        );

        // Option 2: Object spread (safer approach)
        // const result = await createExpense(client, { ...data });

        return NextResponse.json(
          {
            message: "Expense details added successfully.",
            id: result.insertedId,
          },
          { status: 201 }
        );
      }
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        message: "Failed to process the request.",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
