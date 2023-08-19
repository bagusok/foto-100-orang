import { prisma } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ status: false, message: "Ngapain lu!" });

  const body = req.body;

  const editdata = await prisma.User.update({
    where: {
      id: parseInt(body.id),
    },
    data: {
      name: body.name,
      ttl: body.ttl,
      telepon: body.telepon,
      asal: body.asal,
      photoUrl: body.photoUrl,
      motto: body.motto,
    },
  });

  if (!editdata)
    return res.status(404).json({ status: false, message: "Gagal Bos!" });

  return res.status(200).json({ status: true, editdata });
}
