import React, { useEffect, useState } from "react";
import { AutoComplete, Input, Typography } from "antd";
import {
  SAutoComplete,
  SDuration,
  SItemContainer,
  SMediaInfo,
  SOverview,
  SThumbnail,
} from "./SearchBar.styled";
import MediaListItem from "../../models/MediaListItem";
import { SearchOutlined } from "@ant-design/icons";
import Axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import imagePath from "../../assets/placeholder.png";

function SearchBar() {
  const [results, setResults] = useState<MediaListItem[]>([]);
  const [value, setValue] = useState("");
  const history = useHistory();

  function handleSearch(value: string) {
    setValue(value);
    if (value) {
      Axios.get<MediaListItem[]>("/media/search", {
        params: {
          query: value,
        },
      }).then((response) => {
        response.data.forEach((x) => (x.releaseDate = new Date(x.releaseDate)));
        setResults(response.data);
      });
    } else {
      setResults([]);
    }
  }

  function handleOptionClick(value: string, option: any) {
    history.push(`/media/details/${value}`);
    setValue("");
  }
  return (
    <SAutoComplete
      listHeight={500}
      allowClear
      value={value}
      dataSource={results.map((item) => (
        <AutoComplete.Option
          key={item.id.toString()}
          value={item.id.toString()}
        >
          <SItemContainer
            style={{ display: "flex", whiteSpace: "break-spaces" }}
          >
            <SThumbnail
              width={100}
              src={
                item.thumbnailUrl
                  ? `https://image.tmdb.org/t/p/w185${item.thumbnailUrl}`
                  : imagePath
              }
              alt="thumbnail url"
            />
            <SMediaInfo>
              <Typography.Title style={{ marginBottom: 0 }} level={5}>
                {item.title}&nbsp;
                {item.releaseDate && `(${item.releaseDate.getFullYear()})`}
              </Typography.Title>
              {item.duration && (
                <SDuration>{item.duration / 60} minutes</SDuration>
              )}
              <SOverview ellipsis={{ rows: 4 }}>{item.overview}</SOverview>
            </SMediaInfo>
          </SItemContainer>
        </AutoComplete.Option>
      ))}
      notFoundContent={value ? "No media found" : ""}
      onSelect={handleOptionClick}
      onSearch={handleSearch}
    >
      <Input
        size="large"
        placeholder="Search media..."
        prefix={<SearchOutlined />}
      />
    </SAutoComplete>
  );
}

export default SearchBar;
