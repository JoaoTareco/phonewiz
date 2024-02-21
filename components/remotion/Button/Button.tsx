import React, { forwardRef } from "react";
import { Spacing } from "../../Spacing";
import { Spinner } from "../Spinner/Spinner";
import styles from "./styles.module.css";
import {Button} from "../../ui/button"

const ButtonForward: React.ForwardRefRenderFunction<
  HTMLButtonElement,
  {
    onClick?: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    loading?: boolean;
    secondary?: boolean;
  }
> = ({ onClick, disabled, children, loading, secondary }, ref) => {
  return (
    <Button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className="w-40"
    >
      {loading && (
        <>
          <Spinner size={20}></Spinner>
          <Spacing></Spacing>
        </>
      )}
      {children}
    </Button>
  );
};

export const ButtonRe = forwardRef(ButtonForward);
