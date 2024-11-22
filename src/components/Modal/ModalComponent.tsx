"use client";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheckCircle } from "react-icons/fa";

const ModalComponent = ({
    optModal,
    setModal
}: {
    optModal:
    {
        open: boolean,
        status: "success" | "error",
        message: string
    },
    setModal: ({ open, status, message }: {
        open: boolean;
        status: "success" | "error";
        message: string;
    }) => void
}) => {
    return (
        <Modal
            show={optModal.open}
            size="md"
            onClose={() => setModal({ ...optModal, open: false })}
            className="z-9999"
            dismissible
        >
            <Modal.Body>
                <div className="text-center">
                    {optModal.status == "success" ? (
                        <FaCheckCircle className="mx-auto mb-4 h-14 w-14 text-m-400 dark:text-gray-200" />
                    ) : (
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                    )}
                    <h3 className="text-lg font-normal text-gray-500 dark:text-gray-400">
                        {optModal.message}
                    </h3>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ModalComponent;