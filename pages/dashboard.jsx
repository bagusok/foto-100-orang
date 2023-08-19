import ModalEdit, { idModalAtom, showModalAtom } from "@/components/ModalEdit";
import { prisma } from "@/utils/db";
import axios from "axios";
import { useAtom } from "jotai";
import Image from "next/image";

export default function Dashboard({ data }) {
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [idModal, setIdModal] = useAtom(idModalAtom);

  const setModal = (state = false, id = 0) => {
    setShowModal(true);
    setIdModal(id);
  };

  const deleteData = async (id) => {
    let text = "Are you sure to delete?";
    if (confirm(text) == true) {
      const deletes = await axios.post("/api/delete", {
        id: id,
      });

      alert(deletes.data.message);
    }
    window.location.reload();
  };

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <ModalEdit />
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Image
              </th>
              <th scope="col" className="px-6 py-3">
                Nama
              </th>
              <th scope="col" className="px-6 py-3">
                TTL
              </th>
              <th scope="col" className="px-6 py-3">
                No Hp
              </th>
              <th scope="col" className="px-6 py-3">
                Asal
              </th>
              <th scope="col" className="px-6 py-3">
                Motto
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={item.id}
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <Image
                    src={item.photoUrl}
                    className="object-cover w-[50px] h-[70px]"
                    width={50}
                    height={70}
                  />
                </td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.ttl}</td>
                <td className="px-6 py-4">{item.telepon}</td>
                <td className="px-6 py-4">{item.asal}</td>
                <td className="px-6 py-4 truncate">{item.motto}</td>
                <td className="px-6 py-4 inline-flex gap-3">
                  <button
                    onClick={() => setModal(true, item.id)}
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteData(item.id)}
                    className="font-medium text-red-600 dark:text-blue-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const getData = await prisma.User.findMany({
    orderBy: {
      created: "desc",
    },
  });

  return {
    props: {
      data: getData.map((item) => ({
        ...item,
        created: item.created.toString(),
      })),
    },
  };
}
