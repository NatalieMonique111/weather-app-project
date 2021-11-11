import React from "react";
import { Layout } from "antd";
import "./App.css";
import Forecast from "./components/Forecast.js";

const { Header, Content } = Layout;

function App() {
  return (
    <div className="App">
      <Layout>
        <Header>
          <h1
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              color: "white",
            }}
          >
            Weather Channel
          </h1>
        </Header>
        <Content style={{ padding: "0 50px", marginTop: 64 }}>
          <Forecast />
        </Content>
      </Layout>
    </div>
  );
}

export default App;
