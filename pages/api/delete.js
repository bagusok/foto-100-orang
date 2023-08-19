import { prisma } from "@/utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ status: false, message: "Ngapain lu!" });

  const body = req.body;

  const editdata = await prisma.User.delete({
    where: {
      id: parseInt(body.id),
    },
  });

  if (!editdata)
    return res.status(404).json({ status: false, message: "Gagal Bos!" });

  return res
    .status(200)
    .json({ status: true, message: "Berhasil Delete data" });
}
