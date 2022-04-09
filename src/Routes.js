import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Minter from "./components/Minter";
import Game from "./components/Game";
import { useEthers } from "@usedapp/core";
import { useBalanceOf } from "./hooks";

const Routes = () => {
  const { account } = useEthers();
  const balace = useBalanceOf(account);
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Minter} />
        {balace >= 1 ? (
          <Route path="/game" exact component={Game} />
        ) : (
          <Route path="/" exact component={Minter} />
        )}
        <Route component={Minter} />
      </Switch>
      <Footer />
    </BrowserRouter>
  );
};

export default Routes;
