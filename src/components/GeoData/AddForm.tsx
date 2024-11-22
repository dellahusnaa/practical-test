"use client";

import Loader from "@/components/common/LoaderV1";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import MarkerIcon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { Modal, Button } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";


const validateWebsite = (url: string) => {
  const pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
    "(\\#[-a-z\\d_]*)?$", "i" // fragment locator
  );
  return !!pattern.test(url);
};

const validateTelephone = (phone: string) => {
  const pattern = /^0\d{6,12}$/;
  return pattern.test(phone);
};



export default function AddForm() {
  const [showModal, setShowModal] = useState(false);
  const [showBackModal, setShowBackModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [jamMasuk, setJamMasuk] = useState<string>("");
  const [jamKeluar, setJamKeluar] = useState<string>("");
  const [websiteError, setWebsiteError] = useState<string>("");
  const [telephoneError, setTelephoneError] = useState<string>("");
  const [namaLayananError, setNamaLayananError] = useState<string>("");
  const [alamatError, setAlamatError] = useState<string>("");

  const center = {
    lat: -3.3675549,
    lng: 117.1377759,
  };

  const [formData, setFormData] = useState({
    lat: center.lat,
    lng: center.lng,
    namaLayanan: "",
    id: "",
    provinsi: "",
    kotaKabupaten: "",
    jenisLayanan: "",
    website: "",
    jamOperasional: "",
    alamat: "",
    telepon: "",
  });

  const markerRef = useRef<any>(null);
  const router = useRouter();

  const DraggableMarker = () => {
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            const latlng = marker.getLatLng();
            setFormData({ ...formData, lat: latlng.lat, lng: latlng.lng });
          }
        },
      }),
      []
    );

    return (
      <Marker
        draggable={true}
        eventHandlers={eventHandlers}
        position={[formData.lat, formData.lng]}
        ref={markerRef}
        icon={
          new L.Icon({
            iconUrl: MarkerIcon.src,
            iconRetinaUrl: MarkerIcon.src,
            iconSize: [25, 41],
            iconAnchor: [12.5, 41],
            popupAnchor: [0, -41],
          })
        }
      ></Marker>
    );
  };
  const getMarkerGeoComp = async () => {
    const res = await fetch(
      "/api/geoloc/findarea?" +
      new URLSearchParams({
        lat: formData.lat.toString(),
        lng: formData.lng.toString(),
      }),
      {
        method: "GET",
      }
    );
    const { data } = await res.json();
    if (data.length != 0) {
      setFormData({
        ...formData,
        id: data[0]?._id.$oid,
        provinsi: data[0]?.prov,
        kotaKabupaten: data[0]?.name,
      });
    } else {
      setFormData({ ...formData, id: "", provinsi: "None", kotaKabupaten: "None" });
    }
  };

  const combineJamOperasional = () => {
    return `${jamMasuk} - ${jamKeluar}`;
  };



  const addGeoData = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submit starts
    const jamOperasional = combineJamOperasional();
    if (formData.id === "") {
      alert("Provinsi ID tidak ditemukan.");
      setLoading(false); // Set loading to false when there is an error
      return;
    }

    // Validasi Nama Layanan
    const namaLayananRegex = /^[a-zA-Z0-9\s.&-]*$/
    if (!namaLayananRegex.test(formData.namaLayanan)) {
      setNamaLayananError("Nama layanan hanya boleh mengandung huruf, angka, spasi, &, ., dan -.");
      setLoading(false);
      return;
    } else if (formData.namaLayanan.length > 50) {
      setNamaLayananError("Nama layanan tidak boleh lebih dari 50 karakter.");
      setLoading(false);
      return;
    } else {
      setNamaLayananError("");
    }
    
    // Validasi Alamat
    if (formData.alamat.length > 60) {
      setAlamatError("Panjang alamat tidak boleh lebih dari 60 karakter.");
      setLoading(false); // Set loading to false when there is an error
      return;
    }

    // Validasi Website
    if (!validateWebsite(formData.website)) {
      setWebsiteError("Format URL tidak valid. Mohon masukkan URL yang valid, contoh: https://www.contoh.com");
      setLoading(false); // Set loading to false when there is an error
      return;
    }

    // Validasi Telepon
    if (!validateTelephone(formData.telepon)) {
      setTelephoneError("Format nomor telepon tidak valid. Harap masukkan nomor telepon dengan format yang benar, seperti 08xxxxxxxx.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/geodata/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          geoloc_id: formData.id,
          data: {
            latitude: formData.lat,
            longitude: formData.lng,
            namaLayanan: formData.namaLayanan,
            kotaKabupaten: formData.kotaKabupaten,
            provinsi: formData.provinsi,
            jenisLayanan: formData.jenisLayanan,
            website: formData.website,
            jamOperasional: jamOperasional,
            alamat: formData.alamat,
            telepon: formData.telepon,
          },
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setShowModal(true); // Show the success modal
        setTimeout(() => {
          router.push("/database"); // Redirect after a delay
        }, 2000); // Adjust the delay as needed
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (error: any) {
      console.error("Error:", error);
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false); // Set loading to false when submit is complete
    }
  };


  const SuccessModal = () => (
    <Modal
      show={showModal}
      size="md"
      popup
    >

      <Modal.Body>
        <div className="mt-5 text-center">
          <FaCheckCircle className="mx-auto mb-4 h-14 w-14 text-m-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Data baru telah berhasil ditambahkan
          </h3>

        </div>
      </Modal.Body>
    </Modal>
  );

  const BackModal = () => (
    <Modal
      show={showBackModal}
      size="md"
      popup
      className="z-1200"
    >

      <Modal.Body>
        <div className="mt-4 text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
          <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
            Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar tanpa menyimpan?
          </h3>
          <div className="flex justify-center gap-4">
            <Button
              disabled={loading}
              className={`bg-m-100 text-m-200 hover:bg-m-hover03  ${loading ? 'cursor-not-allowed' : ''}`}
              onClick={() => router.push("/database")}
            >
              Ya, Keluar
            </Button>
            <Button color="gray" onClick={() => setShowBackModal(false)}>
              Tidak, Tetap di Sini
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );



  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    getMarkerGeoComp();
  }, [formData.lat, formData.lng]);

  return (
    <>
      <SuccessModal />
      <BackModal />
      <div className="grid  w-full gap-9 ">
        <div className="flex flex-col w-full gap-9">
          {/* <!-- Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="flex gap-4 border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <button
                onClick={() => setShowBackModal(true)}
                className="relative place-content-center rounded-sm font-medium text-m-500 hover:text-m-100 duration-300 ease-in-out"
              >
                <IoArrowBack size={20} />
              </button>
              <h3 className="font-medium text-black dark:text-white">
                Tambah Data
              </h3>
            </div>
            <div className="h-96"
              style={{
                width: "100%",
                paddingBottom: "10px",
                height: "384px",
              }}
            >


              <MapContainer
                center={[center.lat, center.lng]}
                zoom={5}
                scrollWheelZoom={true}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <DraggableMarker />
              </MapContainer>

            </div>
            <form onSubmit={addGeoData}>
              <label className="p-3 text-14 text-gray-400 dark:text-white">
                * Geser marker biru ke posisi yang diinginkan untuk mengetahui koordinat dan lokasi, pastikan tidak berada di laut.
              </label>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Latitude <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    onKeyDown={(e) => {
                      ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                    }}
                    placeholder="Enter Latitude"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter "
                    value={formData.lat}
                    disabled
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Longitude <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    onKeyDown={(e) => {
                      ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();
                    }}
                    placeholder="Enter Longitude"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter "
                    value={formData.lng}
                    disabled
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nama Layanan <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nama layanan"
                    className={`mt-1 block w-full px-3 py-2 border ${namaLayananError ? "border-red-300 dark:border-red-600" : "border-gray-300 dark:border-m-700"
                      } w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter `}
                    value={formData.namaLayanan}
                    onChange={({ target }) =>
                      setFormData({ ...formData, namaLayanan: target.value })
                    }
                    required
                  />
                  {namaLayananError && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">{namaLayananError}</p>
                  )}
                </div>
                <div className="flex flex-nowrap gap-4">
                  <div className="mb-4.5 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Kota/Kabupaten <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter "
                      value={formData.kotaKabupaten}
                      onChange={({ target }) =>
                        setFormData({ ...formData, kotaKabupaten: target.value })
                      }
                      disabled
                    />
                  </div>

                  <div className="mb-4.5 w-full">
                    <label className="mb-2.5 block text-black dark:text-white">
                      Provinsi <span className="text-meta-1">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter "
                      value={formData.provinsi}
                      onChange={({ target }) =>
                        setFormData({ ...formData, provinsi: target.value })
                      }
                      disabled
                    />
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Jenis Layanan <span className="text-meta-1">*</span>
                  </label>
                  <select
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter "
                    value={formData.jenisLayanan}
                    onChange={({ target }) =>
                      setFormData({ ...formData, jenisLayanan: target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Pilih jenis layanan
                    </option>
                    <option value="Klinik">Klinik</option>
                    <option value="Puskesmas">
                      Puskesmas
                    </option>
                    <option value="Rumah Sakit">
                      Rumah Sakit
                    </option>
                  </select>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Website
                  </label>
                  <label className="mb-2.5 block text-12 text-m-800 dark:text-white">
                    Contoh: https://www.contoh.com
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="https://"
                    className={`w-full rounded-lg border py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter ${websiteError
                      ? "border-red-500"
                      : "border-stroke "
                      }`}
                    value={formData.website}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        website: e.target.value,
                      });
                      setWebsiteError(""); // Clear error when user starts typing
                    }}
                  />
                  {websiteError && (
                    <p className="text-red-500 mt-1 text-sm">{websiteError}</p>
                  )}
                </div>


                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Jam Operasional <span className="text-meta-1">*</span>
                  </label>
                  <div className="flex gap-4">
                    <div >
                      <label className="mb-2.5 block  text-12 text-m-800 dark:text-white">
                        Jam Buka
                      </label>
                      <input
                        type="time"
                        placeholder="Masukkan jam masuk"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter "
                        value={jamMasuk}
                        onChange={({ target }) => setJamMasuk(target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-2.5 block  text-12 text-m-800 dark:text-white">
                        Jam Tutup
                      </label>
                      <input
                        type="time"
                        placeholder="Masukkan jam keluar"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter "
                        value={jamKeluar}
                        onChange={({ target }) => setJamKeluar(target.value)}
                        required
                      />

                    </div>
                  </div>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Alamat <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan alamat layanan "
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter ${alamatError ? "border-red-500" : ""
                      }`}
                    value={formData.alamat}
                    onChange={({ target }) =>
                      setFormData({ ...formData, alamat: target.value })
                    }
                    required
                  />
                  {alamatError && (
                    <p className="text-red-500 mt-1 text-sm">{alamatError}</p>
                  )}
                </div>
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Telepon <span className="text-meta-1">*</span>
                  </label>
                  <label className="mb-2.5 block text-12 text-m-800 dark:text-white">
                    Contoh: 08xxxxx
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan nomor telepon layanan"
                    className={`w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:ring-m-400 focus:border-m-400 disabled:cursor-default disabled:bg-whiter  ${telephoneError ? "border-red-500" : ""
                      }`}
                    value={formData.telepon}
                    onChange={({ target }) =>
                      setFormData({ ...formData, telepon: target.value })
                    }
                    required
                  />
                  {telephoneError && (
                    <p className="text-red-500 mt-1 text-sm">{telephoneError}</p>
                  )}
                </div>



                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full rounded bg-m-400 py-3 px-5 font-medium text-m-200 hover:bg-m-hover01 over:text-m-400 ${loading ? 'cursor-not-allowed' : ''}`}
                >
                  {loading ? "Loading..." : "Tambah Data"}
                </button>

              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
}

