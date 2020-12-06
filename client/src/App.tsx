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
  Toolbar, Typography,
  withTheme,
} from "@material-ui/core";
import { Settings } from "@material-ui/icons";
import styled from "styled-components";
import {Route, BrowserRouter, Switch } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

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
  padding-left: 210px;
`;

function App() {
  const [count, setCount] = useState(0);
  return (
    <BrowserRouter>
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
          <Switch>
            <Route path="/dashboard">
              <Dashboard></Dashboard>
            </Route>
            <Route path="/">
              <Dashboard></Dashboard>
            </Route>
          </Switch>
        </Content>
      </div>
    </BrowserRouter>
  );
}

export default App;
