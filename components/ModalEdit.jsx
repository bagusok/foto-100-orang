import axios from "axios";
import { atom, useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export const showModalAtom = atom(false);
export const idModalAtom = atom(0);

export default function ModalEdit() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const [showModal, setShowModal] = useAtom(showModalAtom);
  const getId = useAtomValue(idModalAtom);

  const getData = async (id) => {
    setLoading(true);
    const response = await fetch("/api/get-data?id=" + id);
    const data = await response.json();
    setData(data.data);
    setLoading(false);
  };

  useEffect(() => {
    getData(getId);
  }, [showModal]);

  const editData = async (e) => {
    e.preventDefault();

    console.log({
      name: e.target.name.value,
      ttl: e.target.ttl.value,
      telepno: e.target.telepon.value,
      asal: e.target.asal.value,
      motto: e.target.motto.value,
      image: e.target.image.value,
    });

    const edit = await axios.post("/api/edit", {
      id: getId,
      name: e.target.name.value,
      ttl: e.target.ttl.value,
      telepno: e.target.telepon.value,
      asal: e.target.asal.value,
      motto: e.target.motto.value,
      image: e.target.image.value,
    });

    if (edit.data.ok) {
      alert(edit.data.message);
    } else {
      alert(edit.data.message);
    }
  };

  return (
    <>
      <div
        className={`${
          showModal ? "flex" : "hidden"
        } fixed w-full min-h-screen justify-center items-center bg-black opacity-80`}
      >
        <div className="md:w-96 bg-white rounded-md p-3 z-50 opacity-100">
          <div className="inline-flex w-full justify-end">
            <button
              onClick={() => setShowModal(false)}
              className="hover:opacity-70"
            >
              X
            </button>
          </div>
          <form
            action=""
            className="w-full flex flex-col gap-3"
            onSubmit={(e) => editData(e)}
          >
            <div className="form-group">
              <label htmlFor="name" className="text-sm">
                Nama
              </label>
              <input
                type="text"
                className="w-full text-sm p-2 rounded border border-slate-500 focus:outline-none focus:border-blue-800 focus:border-2"
                placeholder="JohnDoe"
                name="name"
                defaultValue={data?.name}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name" className="text-sm">
                TTL
              </label>
              <input
                type="text"
                className="w-full text-sm p-2 rounded border border-slate-500 focus:outline-none focus:border-blue-800 focus:border-2"
                placeholder="JohnDoe"
                name="ttl"
                defaultValue={data?.ttl}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name" className="text-sm">
                No Hp
              </label>
              <input
                type="text"
                className="w-full text-sm p-2 rounded border border-slate-500 focus:outline-none focus:border-blue-800 focus:border-2"
                placeholder="JohnDoe"
                name="telepon"
                defaultValue={data?.telepon}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name" className="text-sm">
                Asal
              </label>
              <input
                type="text"
                className="w-full text-sm p-2 rounded border border-slate-500 focus:outline-none focus:border-blue-800 focus:border-2"
                placeholder="JohnDoe"
                name="asal"
                defaultValue={data?.asal}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name" className="text-sm">
                Motto
              </label>
              <input
                type="text"
                className="w-full text-sm p-2 rounded border border-slate-500 focus:outline-none focus:border-blue-800 focus:border-2"
                placeholder="JohnDoe"
                name="motto"
                defaultValue={data?.motto}
              />
            </div>
            <div className="form-group">
              <label htmlFor="name" className="text-sm">
                Image Url
              </label>
              <input
                type="text"
                className="w-full text-sm p-2 rounded border border-slate-500 focus:outline-none focus:border-blue-800 focus:border-2"
                placeholder="JohnDoe"
                name="image"
                defaultValue={data?.photoUrl}
              />
            </div>
            <button
              type="submit"
              name="submit"
              className="w-full h-12 flex justify-center items-center bg-blue-800 text-base font-medium rounded text-white"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
