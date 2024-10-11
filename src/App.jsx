import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import HostRanking from './components/HostRanking';
import { fetchHostData } from './api/hostApi';

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  color: #fe2c55;
  font-size: 2.5em;
  margin-bottom: 20px;
`;

function App() {
  const [hosts, setHosts] = useState([]);

  useEffect(() => {
    const getHosts = async () => {
      const data = await fetchHostData();
      setHosts(data);
    };

    getHosts();
    const interval = setInterval(getHosts, 30000); // 30秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  return (
    <AppContainer>
      <Title>TikTokホストランキング</Title>
      <HostRanking hosts={hosts} />
    </AppContainer>
  );
}

export default App;