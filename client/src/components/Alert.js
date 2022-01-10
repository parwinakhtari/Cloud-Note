import React from "react";

export const Alert = (props) => {
  return (
    <div>
      <div className="alert alert-danger" role="alert">
        {props.message}
      </div>
    </div>
  );
};
