import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Typography } from "antd";
import styled from "styled-components";
import Search from "antd/es/input/Search";
import Axios from "axios";

interface UserSettings {
  id: number;
  moviePath: string;
}

const SContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 50%;
  margin-left: auto;
  margin-right: auto;
  padding-top: 10px;
`;

const SButtonRow = styled(Form.Item)`
  text-align: center;
`;

const SUploadInfo = styled.span`
  color: darkorange;
`;

function Settings(props: any) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [formFields, setFormFields] = useState({
    movieFolder: "",
  });

  useEffect(() => {
    Axios.get<UserSettings>("/user/settings").then((response) => {
      setFormFields({
        movieFolder: response.data.moviePath,
      });
    });
  }, []);
  function handleSubmit() {
    Axios.post("/user/settings", {
      moviePath: formFields.movieFolder,
    })
      .then((response) => {
        message.success("Your changes have been saved");
      })
      .catch((error) => {
        message.error(error.response?.data);
      });
  }

  function handleChooseButtonClick() {
    fileRef.current?.click();
  }

  function handleFolderChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormFields({ ...formFields, movieFolder: event.target.value });
  }

  function handleFolderClick(event: React.MouseEvent<HTMLInputElement>) {
    event.currentTarget.value = "";
  }
  return (
    <SContainer>
      <Typography.Title>Settings</Typography.Title>
      <Form style={{ width: "100%" }} onFinish={handleSubmit}>
        <Form.Item label="Movies Folder">
          <Input
            onChange={(event) =>
              setFormFields({ ...formFields, movieFolder: event.target.value })
            }
            value={formFields.movieFolder}
            placeholder="Enter the path to the folder you want to find movies from..."
          />
        </Form.Item>
        <SButtonRow>
          <Button
            htmlType="submit"
            style={{ width: 200, height: 40 }}
            type="primary"
          >
            Save Changes
          </Button>
        </SButtonRow>
      </Form>
    </SContainer>
  );
}

export default Settings;
