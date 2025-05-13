"use client";
import { useContext } from "react";
import { WalletContext } from "@/context/WalletContext";
import { utils } from "zksync-ethers";
import { PAYMASTER_ADDRESS } from "@/constants/contracts";

export const usePaymaster = () => {
  const { provider, account } = useContext(WalletContext);

  const paymasterParams = async () => {
    if (!provider || !account) return {};

    return {
      paymaster: PAYMASTER_ADDRESS,
      paymasterInput: utils.getPaymasterInput({
        type: "General",
        innerInput: "0x",
      }),
    };
  };

  return { paymasterParams };
};
