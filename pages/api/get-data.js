import { prisma } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "GET")
    return res.status(405).json({ status: false, message: "Ngapain lu!" });

  const id = req.query.id;
  if (!id)
    return res.status(400).json({ status: false, message: "id required" });

  const data = await prisma.User.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!data)
    return res.status(404).json({ status: false, message: "data not found" });

  return res.status(200).json({ status: true, data });
}
