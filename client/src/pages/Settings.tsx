import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, message, Spin, Typography } from "antd";
import styled from "styled-components";
import Search from "antd/es/input/Search";
import Axios from "axios";
import UserSettings from "../models/UserSettings";
import UpdateUserSettings from "../models/UpdateUserSettings";
import Library from "../models/Library";
import PageContainer from "../components/PageContainer";

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
    const [userSettings, setUserSettings] = useState({} as UserSettings);
    const [newLibraries, setNewLibraries] = useState([] as Library[]);
    const [existingLibraries, setExistingLibraries] = useState([] as Library[]);
    const [removedLibraries, setRemovedLibraries] = useState([] as Library[]);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        Axios.get<UserSettings>("/user/settings").then((response) => {
            setFormFields({
                movieFolder: response.data.libraries[0].folderPath,
            });
            setUserSettings(response.data);
            setExistingLibraries(response.data.libraries);
            setLoaded(true);
        });
    }, []);
    function handleSubmit() {
        Axios.post("/user/settings", {
            newLibraries: newLibraries,
            existingLibraries: existingLibraries,
            removedLibraries: removedLibraries,
        })
            .then((response) => {
                message.success("Your changes have been saved");
            })
            .catch((error) => {
                message.error(error.response?.data);
            });
    }

    function handleLibraryValueChange(libraryId: number, value: string) {
        const newLibraries = [...existingLibraries];
        const library = newLibraries.find((x) => x.id === libraryId);
        if (library) {
            library.folderPath = value;
        }
        setExistingLibraries(newLibraries);
    }
    return (
        <SContainer>
            <PageContainer loading={!loaded}>
                <Typography.Title level={2}>Settings</Typography.Title>
                <Form style={{ width: "100%" }} onFinish={handleSubmit}>
                    {existingLibraries.map((item) => (
                        <Form.Item key={item.id} label={item.name}>
                            <Input
                                onChange={(event) => handleLibraryValueChange(item.id, event.currentTarget.value)}
                                value={item.folderPath}
                                placeholder="Enter the path to the folder you want to find media from..."
                            />
                        </Form.Item>
                    ))}

                    <SButtonRow>
                        <Button htmlType="submit" style={{ width: 200, height: 40 }} type="primary">
                            Save Changes
                        </Button>
                    </SButtonRow>
                </Form>
            </PageContainer>
        </SContainer>
    );
}

export default Settings;
