export default async function handler(req, res) {
  if (req.method === "POST") {
    // Log the incoming request body
    console.log("Request body:", req.body);
    // Respond with success
    return res.status(200).json({ message: "POST request logged" });
  }
  // Handle unsupported methods
  res.setHeader("Allow", ["POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
