import React, { useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import Axios from "axios";
import { useDispatch } from "react-redux";
import librarySlice from "../../store/librarySlice";

function ReloadLibraryButton() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  function buttonClick() {
    setLoading(true);
    Axios.post("/libraries/reload")
      .then((response) => {
        message.success("Successfully refreshed libraries");
        setLoading(false);
        dispatch(
          librarySlice.actions.setLibrariesUpdated({
            id: -1,
            updated: true,
          })
        );
      })
      .catch((error) => {
        message.error(error.response?.data);
        setLoading(false);
      });
  }
  return (
    <Button onClick={buttonClick} loading={loading} icon={<ReloadOutlined />}>
      Refresh Libraries
    </Button>
  );
}

export default ReloadLibraryButton;
