import React, { useState } from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Axios from "axios";

function ReloadLibraryButton() {
  const [loading, setLoading] = useState(false);

  function buttonClick() {
    Axios.post("/");
  }
  return (
    <Button loading={loading} icon={<ReloadOutlined />}>
      Refresh Libraries
    </Button>
  );
}

export default ReloadLibraryButton;
