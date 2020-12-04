import React, { useState } from "react";
import logo from "./logo.svg";
import {
  AppBar,
  Button,
  createMuiTheme,
  CssBaseline,
  Drawer,
  DrawerProps,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  ThemeProvider,
  Toolbar,
  withTheme,
} from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import styled from "styled-components";

const StyledAppBar = styled(AppBar)`
  z-index: 1400;
`;

const StyledToolbar = styled(Toolbar)`
  justify-content: flex-end;
`;

const StyledDrawer = styled(Drawer)`
  width: 100px;
  & .MuiPaper-root {
    width: 200px;
  },
  flex-shrink: 0;
`;

const Content = styled.div`
  flex-grow: 1;
`;

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <CssBaseline />
      <div>
        <StyledAppBar variant="outlined" position="fixed" color="inherit">
          <StyledToolbar>
            <IconButton>
              <Settings />
            </IconButton>
          </StyledToolbar>
        </StyledAppBar>
        <StyledDrawer variant="permanent">
          <Toolbar />
          <div>
            <List>
              <ListItem button>
                <ListItemText>Home</ListItemText>
              </ListItem>
            </List>
          </div>
        </StyledDrawer>
        <Content>
          <Toolbar />
          <div>this is a test</div>
        </Content>
      </div>
    </div>
  );
}

export default App;
