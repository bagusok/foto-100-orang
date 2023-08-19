import axios from "axios";
import ImageKit from "imagekit";
import { PrismaClient } from "@prisma/client";
import { dataOrang } from "@/utils/data-orang";

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
  // console.log(body);

  const countPhoto = body.message.photo.length;

  const getPhotoData = await axios.get(
    "https://api.telegram.org/bot" +
      process.env.TELEGRAM_TOKEN +
      "/getFile?file_id=" +
      body.message.photo[countPhoto - 1]?.file_id
  );

  // console.log("getPhotoData", getPhotoData);

  const photoUrl =
    "https://api.telegram.org/file/bot" +
    process.env.TELEGRAM_TOKEN +
    "/" +
    getPhotoData.data.result.file_path;

  let name, ttl, tlp, address, motto;

  if (body.message.caption.includes("/id")) {
    const id = body.message.caption.split(" ")[1];
    const findData = dataOrang.find((item) => item.id == id);
    // console.log("findData", findData);
    if (findData) {
      await axios.post(
        "https://api.telegram.org/bot" +
          process.env.TELEGRAM_TOKEN +
          "/sendMessage",
        {
          chat_id: body.message.chat.id,
          text: `Nama: ${findData.nama}\nTTL: ${findData.ttl}\nTelepon: ${findData.telepon}\nAlamat: ${findData.asal}\nMotto: ${findData.motto}\nKelompok: ${findData.kelompok}`,
        }
      );

      name = findData.nama;
      ttl = findData.ttl;
      tlp = findData.telepon;
      address = findData.asal;
      motto = findData.motto;
    } else {
      await axios.post(
        "https://api.telegram.org/bot" +
          process.env.TELEGRAM_TOKEN +
          "/sendMessage",
        {
          chat_id: body.message.chat.id,
          text: `Data tidak ditemukan.`,
        }
      );

      name = "Unknown Name";
      ttl = "";
      tlp = "";
      address = "";
      motto = "";
    }
  } else {
    const spliter = body.message.caption.split("\n");
    name = spliter[0] == "-" ? "" : spliter[0];
    ttl = spliter[1] == "-" ? "" : spliter[1];
    tlp = spliter[2] == "-" ? "" : spliter[2];
    address = spliter[3] == "-" ? "" : spliter[3];
  }

  try {
    const uploadImagekit = await imagekit.upload({
      file: photoUrl,
      fileName: body.message.caption.split("\n")[0] || "gaada" + ".jpg",
      folder: "/telegram",
      useUniqueFileName: true,
    });

    const cropImage = uploadImagekit.url + "?tr=w-354,h-472,fo-auto";

    const saveToDb = await prisma.User.create({
      data: {
        name: name,
        ttl: ttl,
        telepon: tlp,
        asal: address,
        motto: motto,
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
