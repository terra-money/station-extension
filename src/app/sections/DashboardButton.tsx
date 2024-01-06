import React, { ForwardedRef, forwardRef } from 'react';
import { ReactComponent as Dashboard } from "styles/images/icons/Dashboard.svg";
import HeaderIconButton from "app/components/HeaderIconButton";
import { STATION } from "config/constants";

const DashboardButton = forwardRef((_, ref: ForwardedRef<HTMLButtonElement>) => {
    const openDashboard = () =>  window.open(STATION, "_blank");
    return (
        <HeaderIconButton onClick={openDashboard} ref={ref}>
            <Dashboard style={{ height: 18, color: "var(--token-dark-900)" }} />
        </HeaderIconButton>
    );
});

export default DashboardButton;
