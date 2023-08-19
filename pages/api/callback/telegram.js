import axios from "axios";
import ImageKit from "imagekit";
// import prisma from "../../../utils/db";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Ngapain lu!" });

  const body = req.body;
  console.log(body);

  const countPhoto = body.message.photo.length;

  const getPhotoData = await axios.get(
    "https://api.telegram.org/bot" +
      process.env.TELEGRAM_TOKEN +
      "/getFile?file_id=" +
      body.message.photo[countPhoto - 1]?.file_id
  );

  console.log("getPhotoData", getPhotoData);

  const photoUrl =
    "https://api.telegram.org/file/bot" +
    process.env.TELEGRAM_TOKEN +
    "/" +
    getPhotoData.data.result.file_path;

  console.log(photoUrl);

  try {
    const uploadImagekit = await imagekit.upload({
      file: photoUrl,
      fileName: body.message.caption.split("\n")[0] || "gaada" + ".jpg",
      folder: "/telegram",
      useUniqueFileName: true,
    });

    const spliter = body.message.caption.split("\n");
    const name = spliter[0] == "-" ? "" : spliter[0];
    const ttl = spliter[1] == "-" ? "" : spliter[1];
    const tlp = spliter[2] == "-" ? "" : spliter[2];
    const address = spliter[3] == "-" ? "" : spliter[3];

    const cropImage = uploadImagekit.url + "?tr=w-354,h-472,fo-auto";

    const saveToDb = await prisma.User.create({
      data: {
        name: name,
        ttl: ttl,
        telepon: tlp,
        asal: address,
        photoUrl: cropImage,
      },
    });

    if (saveToDb) {
      await axios.post(
        "https://api.telegram.org/bot" +
          process.env.TELEGRAM_TOKEN +
          "/sendMessage",
        {
          chat_id: body.message.chat.id,
          text: `Data ${name} berhasil disimpan.`,
        }
      );
    } else {
      await axios.post(
        "https://api.telegram.org/bot" +
          process.env.TELEGRAM_TOKEN +
          "/sendMessage",
        {
          chat_id: body.message.chat.id,
          text: `Oops, Data Gagal di Simpan.`,
        }
      );
    }
  } catch (e) {
    console.log(e.message);
  }

  res.status(200).json({ text: "Hello Bang" });
}
