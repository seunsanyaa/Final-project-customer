// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

// Define the structure of the response data
interface Data {
  name: string;
  greeting: string;
}

/**
 * API route handler for /api/hello
 * @param req - The incoming request object
 * @param res - The response object to send back
 */
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Get the name from the query parameter or use a default value
  const name = req.query.name as string || "John Doe";

  // Prepare the response data
  const responseData: Data = {
    name: name,
    greeting: `Hello, ${name}!`
  };

  // Send the response with a 200 OK status
  res.status(200).json(responseData);
}
