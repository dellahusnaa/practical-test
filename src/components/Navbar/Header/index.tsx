
import { Session } from "next-auth";
import React, { useState } from "react";
import { Modal, Button } from "flowbite-react";
import { signOut } from "next-auth/react";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const Header = (props: {
    session: Session | null
}) => {
    const [showBackModal, setShowBackModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const signoutBttn = async () => {
        try {
            setIsLoading(true);
            const status = await signOut({
                redirect: true,
                callbackUrl: "/",
            });
            setIsLoading(false);
            return { message: "Success" };
        } catch (e) {
            setIsLoading(false);
            return { message: "Sign Out failed" };
        }
    };

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
                        Apakah Anda yakin ingin keluar?
                    </h3>
                    <div className="flex justify-center gap-4">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`bg-white text-m-200 hover:bg-m-100 hover:text-white  ${isLoading ? 'cursor-not-allowed' : ''}`}
                            onClick={signoutBttn}
                        >
                            Iya
                        </Button>
                        <Button color="gray" onClick={() => setShowBackModal(false)}>
                            Tidak
                        </Button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
    return (
        <>
            <BackModal />
            <header className="sticky top-0 z-1200 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
                <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">

                    <div className="flex  gap-3 2xsm:gap-7 ">

                        <span className="hidden text-right lg:block">
                            <span className="block text-sm font-medium text-black dark:text-white">
                                {props.session?.user?.name}
                            </span>
                            <span className="block text-xs">Selamat Datang!</span>
                        </span>


                    </div>
                    <div className=" flex items-end grid-rows-subgrid gap-4 row-span-8 ">
                        <button

                            className="flex items-center gap-3 py-4 px-4 text-16 font-medium duration-300 ease-in-out text-black hover:text-m-200"
                            onClick={() => setShowBackModal(true)}
                        >
                            <svg
                                className="fill-current"
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15.5375 0.618744H11.6531C10.7594 0.618744 10.0031 1.37499 10.0031 2.26874V4.64062C10.0031 5.05312 10.3469 5.39687 10.7594 5.39687C11.1719 5.39687 11.55 5.05312 11.55 4.64062V2.23437C11.55 2.16562 11.5844 2.13124 11.6531 2.13124H15.5375C16.3625 2.13124 17.0156 2.78437 17.0156 3.60937V18.3562C17.0156 19.1812 16.3625 19.8344 15.5375 19.8344H11.6531C11.5844 19.8344 11.55 19.8 11.55 19.7312V17.3594C11.55 16.9469 11.2062 16.6031 10.7594 16.6031C10.3125 16.6031 10.0031 16.9469 10.0031 17.3594V19.7312C10.0031 20.625 10.7594 21.3812 11.6531 21.3812H15.5375C17.2219 21.3812 18.5625 20.0062 18.5625 18.3562V3.64374C18.5625 1.95937 17.1875 0.618744 15.5375 0.618744Z"
                                    fill=""
                                />
                                <path
                                    d="M6.05001 11.7563H12.2031C12.6156 11.7563 12.9594 11.4125 12.9594 11C12.9594 10.5875 12.6156 10.2438 12.2031 10.2438H6.08439L8.21564 8.07813C8.52501 7.76875 8.52501 7.2875 8.21564 6.97812C7.90626 6.66875 7.42501 6.66875 7.11564 6.97812L3.67814 10.4844C3.36876 10.7938 3.36876 11.275 3.67814 11.5844L7.11564 15.0906C7.25314 15.2281 7.45939 15.3312 7.66564 15.3312C7.87189 15.3312 8.04376 15.2625 8.21564 15.125C8.52501 14.8156 8.52501 14.3344 8.21564 14.025L6.05001 11.7563Z"
                                    fill=""
                                />
                            </svg>
                            Keluar
                        </button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
