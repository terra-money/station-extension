import { useAuth } from "auth";
import { bech32 } from "bech32";
import is from "auth/scripts/is";
import styles from "./ManageWalletsButton.module.scss";
// icons
import { ReactComponent as WalletIcon } from "styles/images/icons/Wallet.svg";
import UsbIcon from "@mui/icons-material/Usb";
import BluetoothIcon from "@mui/icons-material/Bluetooth";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import { forwardRef, ForwardedRef } from "react";
import { useTranslation } from "react-i18next";

const ManageWalletsButton = forwardRef((_, ref: ForwardedRef<HTMLButtonElement>) => {
  const navigate = useNavigate();
  const { wallet, wallets } = useAuth();
  const { t } = useTranslation();

  const selectedWallet = wallets.find((w) => {
    if ("words" in w) {
      return w.words["330"] === wallet?.words["330"];
    } else {
      return (
        Buffer.from(bech32.decode(w.address).words).toString("hex") ===
        wallet?.words["330"]
      );
    }
  });

  const isLedger = is.ledger(wallet);

  if (!selectedWallet && !isLedger) {
    return (
      <button className={styles.manage__wallets} onClick={() => navigate("/")} ref={ref}>
        <WalletIcon style={{ fontSize: 18 }} /> {t("Connect wallet")}
      </button>
    );
  }

  return (
    <button
      className={styles.manage__wallets}
      data-testid="manage-wallets-button"
      onClick={() => navigate("/manage-wallet/select")}
      ref={ref}
    >
      {isLedger ? (
        wallet.bluetooth ? (
          <BluetoothIcon style={{ fontSize: 18 }} />
        ) : (
          <UsbIcon style={{ fontSize: 18 }} />
        )
      ) : (
        <WalletIcon style={{ fontSize: 18 }} />
      )}{" "}
      <div className={styles.selector}>
        <span>{wallet && "name" in wallet ? wallet.name : "Ledger"}</span>
        <ArrowDropDownIcon />
      </div>
    </button>
  );
});

export default ManageWalletsButton;
