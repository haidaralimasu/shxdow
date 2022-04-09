import React, { useState } from "react";
import { constants } from "ethers";
import { useEthers } from "@usedapp/core";
import Navbar from "./Navbar";
import Footer from "./Footer";
import {
  useTotalSupply,
  useUserMintLimit,
  useBalanceOf,
  useMaxSupply,
  useCost,
  useWeiCost,
} from "../hooks";
import { address } from "../contracts/config";
import nftabi from "../contracts/NFT.json";
import { ethers } from "ethers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notifyMintSuccess, notifyError, notifyNetwork } from "../toast";
import banner from "../banner.png";

const Minter = () => {
  const totalSupply = useTotalSupply();
  const cost = useCost();
  const weiCost = useWeiCost();
  const maxSupply = useMaxSupply();
  const [minting, setMinting] = useState(false);
  const { activateBrowserWallet, account } = useEthers();
  const balance = useBalanceOf(account);
  const nftbalance = balance ? balance : 0;
  const [formInput, updateFormInput] = useState({ name: "" });
  const limit = useUserMintLimit();
  const nftlimit = limit ? limit : 0;

  const nftInterface = new ethers.utils.Interface(nftabi);

  const onError = () => {
    notifyNetwork();
  };

  async function handleMint() {
    try {
      if (formInput.name != "") {
        if (formInput.name.length <= 10) {
          setMinting(true);
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();

          let nftcontract = new ethers.Contract(address, nftInterface, signer);
          let transaction = await nftcontract.mint(1, formInput.name, {
            value: weiCost,
          });
          await transaction.wait();
          setMinting(false);
          updateFormInput({ name: "" });
          notifyMintSuccess();
        } else {
          notifyError("Name Must Be less than or equal to 10 characters");
          setMinting(false);
        }
      } else {
        notifyError("Input Cannot Be Empty");
        setMinting(false);
      }
    } catch (error) {
      notifyError(error.message);
      updateFormInput({ name: "" });
      setMinting(false);
    }
  }

  console.log(maxSupply);

  return (
    <>
      <div className="minter-main">
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <h1 className="minter-h1">
          <img src={banner} height="200px" alt="banner" />
        </h1>
        <div className="minting-section">
          {account ? (
            <div className="minting-section">
              <button className="connect btn btn-gradient-blue">{`${account.slice(
                0,
                6
              )}...${account.slice(-6)}`}</button>
              <h2 style={{ color: "white", marginTop: "20px" }}>
                Type Your Name Here
              </h2>
              <input
                style={{ width: "300px", marginBottom: "-5px" }}
                onChange={(e) =>
                  updateFormInput({ ...formInput, name: e.target.value })
                }
                type="Name"
                className="btn mint  btn-gradient-blue"
              />
              <button
                onClick={() => handleMint()}
                className="btn mint  btn-gradient-blue"
              >
                {minting ? "Please Wait" : "Mint"}
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => activateBrowserWallet(onError)}
                className="connect btn btn-gradient-blue"
              >
                Connect
              </button>
            </div>
          )}
        </div>
        ) : (<div className="minting-section"></div>
        {totalSupply < maxSupply ? (
          <div className="minter-status">
            <div className="minter-status-card">
              <h6>Status</h6>
              <h2>Live</h2>
            </div>
            <div className="vl"></div>
            <div className="minter-status-card">
              <h6>Price</h6>
              <h2>
                {cost} {constants.EtherSymbol}
              </h2>
            </div>
            <div className="vl"></div>
            {account ? (
              <div className="minter-status-card">
                <h6>Your Mint</h6>
                <h2>
                  {nftbalance}/{nftlimit}
                </h2>
              </div>
            ) : null}
            <div className="vl"></div>
            <div className="minter-status-card">
              <h6>Total Minted</h6>
              <h2>
                {totalSupply}/{maxSupply}
              </h2>
            </div>
          </div>
        ) : (
          <div className="minter-status">
            <div className="minter-status-card">
              <h6>Status</h6>
              <h2>Live</h2>
            </div>
            <div className="vl"></div>
            <div className="minter-status-card">
              <h6>Price</h6>
              <h2>
                {cost}

                {constants.EtherSymbol}
              </h2>
            </div>
            <div className="vl"></div>
            <div className="minter-status-card">
              <h6>Total Minted</h6>
              <h2>{totalSupply}</h2>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Minter;
