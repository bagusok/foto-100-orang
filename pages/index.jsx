import { prisma } from "@/utils/db";
import { Document, Page, View, Text, PDFViewer } from "@react-pdf/renderer";
import { Image, StyleSheet } from "@react-pdf/renderer";

export default function Home({ data }) {
  return (
    <>
      <div
        className="w-full flex flex-col gap-3 min-h-screen"
        // style={{
        //   padding: "2cm 2cm 2cm 3cm",
        // }}
      >
        {data.map((item) => {
          return (
            <div className="flex" key={item.id}>
              <div className="w-fit">
                <img
                  src={item.photoUrl}
                  alt=""
                  style={{ height: "4cm", width: "3cm" }}
                />
                {/* <p>{JSON.stringify(data)}</p> */}
              </div>
              <div className="w-fit p-2 rounded-md ">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <tbody>
                    <tr className="border border-gray-200 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-1 text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      >
                        Nama
                      </th>
                      <td class="px-6 py-1">{item.name}</td>
                    </tr>
                    <tr className="border border-gray-200 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-1 text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      >
                        Tempat, Tanggal Lahir
                      </th>
                      <td class="px-6 py-1">{item.ttl}</td>
                    </tr>
                    <tr className="border border-gray-200 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-1 text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      >
                        Nomer Hp
                      </th>
                      <td class="px-6 py-1">{item.telepon}</td>
                    </tr>
                    <tr className="border border-gray-200 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-1 text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      >
                        Asal Daerah
                      </th>
                      <td class="px-6 py-1">{item.asal}</td>
                    </tr>
                    <tr className="border border-gray-200 dark:border-gray-700">
                      <th
                        scope="row"
                        class="px-6 py-1 text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      >
                        Motto
                      </th>
                      <td class="px-6 py-1"></td>
                    </tr>
                    <tr className="border border-gray-200 dark:border-gray-700">
                      <th
                        style={{
                          height: "2cm",
                        }}
                        scope="row"
                        class="px-6 text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                      >
                        Tanda Tangan
                      </th>
                      <td
                        style={{
                          height: "2cm",
                        }}
                        class="px-6"
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// export default function Index() {
//   return (
//     <PDFViewer>
//       <Home />
//     </PDFViewer>
//   );
// }

// export function Home({ data }) {
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <View style={styles.section}>
//         <Text>Nama</Text>
//         <View style={styles.tableRow}>
//           <View style={styles.tableCell}>
//             <Text>Nama 1</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>Nama 2</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>Nama 3</Text>
//           </View>
//         </View>
//       </View>
//       <View style={styles.section}>
//         <Text>Alamat</Text>
//         <View style={styles.tableRow}>
//           <View style={styles.tableCell}>
//             <Text>Alamat 1</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>Alamat 2</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>Alamat 3</Text>
//           </View>
//         </View>
//       </View>
//       <View style={styles.section}>
//         <Text>Nomer Telepon</Text>
//         <View style={styles.tableRow}>
//           <View style={styles.tableCell}>
//             <Text>Nomer 1</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>Nomer 2</Text>
//           </View>
//           <View style={styles.tableCell}>
//             <Text>Nomer 3</Text>
//           </View>
//         </View>
//         <Image src="path_ke_gambar_1.jpg" style={styles.image} />
//         <Image src="path_ke_gambar_2.jpg" style={styles.image} />
//         <Image src="path_ke_gambar_3.jpg" style={styles.image} />
//       </View>
//     </Page>
//   </Document>;
// }

export async function getServerSideProps() {
  const getData = await prisma.user.findMany({
    orderBy: {
      created: "asc",
    },
  });

  // console.log(getData);

  return {
    props: {
      data: getData.map((item) => {
        return {
          ...item,
          created: item.created.toString(),
        };
      }),
    },
  };
}