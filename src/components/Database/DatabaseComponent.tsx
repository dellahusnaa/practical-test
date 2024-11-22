-"use client";

import { useEffect, useState, useCallback } from "react";
import DataCard from "@/components/Card Data/DataCard";
import { ClipLoader } from "react-spinners";
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Modal } from "flowbite-react";
import { FaCheckCircle } from "react-icons/fa";

function DatabaseComponent() {
    const [loading, setLoading] = useState<boolean>(true);
    type GeoData = {
        id: string;
        judul: string;
        detail: string;
        caption: string;
    };

    const [geodatas, setGeodatas] = useState<{ data: GeoData[]; count: number }>({
        data: [],
        count: 0,
    });
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        judul: "",
        caption: "",
        detail: "",
    });

    const geodataAPI = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/geodata", {
                method: "GET",
                cache: "no-store",
            });
            const { data, count } = await res.json();
            setGeodatas({ data, count });
        } finally {
            setLoading(false);
        }
    }, []);

    const addGeoData = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when submit starts

        try {
            const res = await fetch("/api/geodata/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    judul: formData.judul,
                    caption: formData.caption,
                    detail: formData.detail,
                }),
            });

            if (res.ok) {
                const result = await res.json();
                handleCloseModal(); // Tutup form modal
                setShowModal(true); // Tampilkan modal sukses

                setTimeout(() => setShowModal(false), 500); // Tutup modal sukses setelah 3 detik

                setGeodatas((prev) => ({
                    data: [result.data, ...prev.data], // Tambahkan data baru ke awal array
                    count: prev.count + 1,
                }));
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

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        // setFormData({ judul: "", caption: "" }); // Reset form
    };

    const SuccessModal = () => (
        <Modal show={showModal} size="md" popup>
            <Modal.Body>
                <div className="mt-5 text-center">
                    <FaCheckCircle className="mx-auto mb-4 h-14 w-14 text-m-200 dark:text-gray-200" />
                    <h3 className="mb-5 text-lg font-normal text-gray-200 dark:text-gray-400">
                        Data baru telah berhasil ditambahkan
                    </h3>
                </div>
            </Modal.Body>
        </Modal>
    );

    useEffect(() => {
        geodataAPI();
    }, [geodataAPI]);

    return (
        <>
            <SuccessModal />
            <div className="mt-10 grid place-content-center w-full">
                <p className="grid text-46 place-content-center mb-4 font-extrabold leading-none tracking-tight text-m-200 dark:text-white">
                    Database Bencana Alam
                </p>
                <p className="text-center mx-72 mb-6 text-16 font-normal text-gray-500 dark:text-gray-400">
                    Halaman ini menampilkan update bencana alam di Indonesia
                </p>
            </div>


            <div className="mt-8 relative w-full">
                {loading ? (
                    <div className="grid place-content-center ">
                        <ClipLoader color={"#123abc"} loading={loading} size={50} />
                    </div>
                ) : (
                    <>

                        <DataCard data={geodatas.data} />


                        {geodatas.data.length === 0 && (
                            <div className="w-full flex items-center justify-center mx-auto">
                                <p className="text-gray-500 dark:text-gray-400">Tidak ada data</p>
                            </div>
                        )}

                    </>


                )}
                <div className="border  fixed buttom-0 right-5 z-1200  mx-8 mt-4">
                    <Button
                        className="px-5 py-2 rounded-md bg-blue-500 text-white "
                        onClick={handleOpenModal}
                    >
                        PostNews
                    </Button>
                </div>


            </div>


            {/* Modal */}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <form onSubmit={addGeoData}>
                    <DialogTitle>Bencana Baru</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="judul"
                            label="Judul"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.judul}
                            onChange={({ target }) =>
                                setFormData({ ...formData, judul: target.value })
                            }
                        />
                        <TextField
                            margin="dense"
                            name="caption"
                            label="Caption"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formData.caption}
                            onChange={({ target }) =>
                                setFormData({ ...formData, caption: target.value })
                            }
                        />
                        <TextField
                            margin="dense"
                            name="Detail"
                            label="Detail"
                            type="textarea"
                            fullWidth
                            variant="outlined"
                            value={formData.detail}
                            onChange={({ target }) =>
                                setFormData({ ...formData, detail: target.value })
                            }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

        </>
    );
}

export default DatabaseComponent;
