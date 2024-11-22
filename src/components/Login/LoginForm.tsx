"use client"
import React, { useEffect, useState } from "react";
import { Button, Label } from "flowbite-react";
import { useFormState } from "react-dom";
import { LoginAction } from "./LoginAction";
import ModalComponent from "@/components/Modal/ModalComponent";

const initialState = {
  message: null,
};

function LoginForm() {
  const [state, loginFormAction] = useFormState(LoginAction, initialState); // Menggunakan hook useFormState untuk mengelola state form dan aksi login
  const [disableLogin, setDisableLogin] = useState(false);
  const [optModal, setOptModal] = useState<{
    open: boolean;
    status: "success" | "error";
    message: string;
  }>({
    open: false,
    status: "success",
    message: "",
  });

  const setModal = ({ open, status, message }: { open: boolean, status: "success" | "error", message: string }) => {
    setOptModal({ open: open, status: status, message: message });
  }
  useEffect(() => {
    if (state.message == null) {
      return
    }
    setDisableLogin(false);
    setOptModal({ open: true, status: state.message == "success" ? "success" : "error", message: state.message });
  }, [state])

  useEffect(() => {
    if (optModal.open) {
      setTimeout(() => { setOptModal({ ...optModal, open: false }) }, 2000)
    }
  }, [optModal])

  return (
    <>
      <ModalComponent optModal={optModal} setModal={setModal} />
      <div className="bg-[#003A40] w-screen h-full">
        <div className="flex w-full h-full py-10 my-auto mx-autorounded-sm dark:border-strokedark dark:bg-boxdark">
          <div className=" mx-12 w-full grid content-center  place-items-start">
            <div className=" w-full py-3  ">
              <div className="m-0 text-36 text-white leading-44">
                &quot;AYOO, Update bencana alam di sekitarmu!!&quot;
              </div>
              <div className="mt-12 text-16 text-white font-normal leading-24">
                - BNPB
              </div>
            </div>
          </div>
          <div className="mx-12 grid h-full w-full place-items-center">
            <div className=" w-max py-3 xl:py-15 px-[5%] lg:px-[10%] border border-stroke rounded-lg bg-white shadow-default">
              <form
                className="flex w-full flex-col gap-4"

                onSubmit={(e) => {
                  setDisableLogin(true);
                }}
                action={loginFormAction}
              >
                <h2 className="text-2xl font-bold text-[#263238] dark:text-white sm:text-title-xl2">
                  Selamat Datang

                </h2>
                <div className="text-16">
                  Login untuk terkoneksi ke home page
                </div>

                <div>
                  <div className="mb-2 block">
                    <Label className="text-md" htmlFor="email" value="Email" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Masukkan email"
                    required
                    className="w-full px-2 border text-m-200 border-gray-200 rounded-lg focus:ring-0 focus:border-m-200 focus:border-2  focus:outline-none"
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label
                      className="text-md"
                      htmlFor="password"
                      value="Password"
                    />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    required
                    className="w-full px-2 border text-m-200 border-gray-200 rounded-lg focus:ring-0 focus:border-m-200 focus:border-2  focus:outline-none"
                  />
                </div>
                <Button
                  id="login-bttn"
                  className="border-0 focus:outline-none rounded-md transition-all duration-500 hover:bg-m-hover02 font-semibold text-m-200 bg-m-200 hover:text-m-200"
                  type="submit"
                  disabled={disableLogin}
                >
                  <span className="font-satoshi text-base">Masuk</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div >
    </>
  );
}

export default LoginForm;
