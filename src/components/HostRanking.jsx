import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const RankingTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  background-color: #fe2c55;
  color: white;
  padding: 12px;
  text-align: left;
  border-radius: 4px;
`;

const TableRow = styled(motion.tr)`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TableCell = styled.td`
  padding: 12px;
  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

const ChangeIndicator = styled.span`
  margin-left: 8px;
  font-weight: bold;
  color: ${props => props.change > 0 ? 'green' : props.change < 0 ? 'red' : 'inherit'};
`;

const HostIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

function HostRanking({ hosts }) {
  const [prevRanks, setPrevRanks] = useState({});

  useEffect(() => {
    const newRanks = {};
    hosts.forEach((host, index) => {
      newRanks[host.id] = index + 1;
    });

    setPrevRanks(prevRanks => {
      const updatedRanks = { ...prevRanks };
      hosts.forEach(host => {
        if (!(host.id in updatedRanks)) {
          updatedRanks[host.id] = newRanks[host.id];
        }
      });
      return updatedRanks;
    });
  }, [hosts]);

  const getRankChange = (hostId, currentRank) => {
    if (!(hostId in prevRanks)) return 0;
    return prevRanks[hostId] - currentRank;
  };

  return (
    <RankingTable>
      <thead>
        <tr>
          <TableHeader>順位</TableHeader>
          <TableHeader>アイコン</TableHeader>
          <TableHeader>配信者名</TableHeader>
          <TableHeader>視聴人数</TableHeader>
        </tr>
      </thead>
      <AnimatePresence>
        <tbody>
          {hosts.map((host, index) => {
            const currentRank = index + 1;
            const rankChange = getRankChange(host.id, currentRank);
            return (
              <TableRow
                key={host.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 1, type: "spring", stiffness: 100 }}
                layout
              >
                <TableCell>{currentRank}</TableCell>
                <TableCell>
                  {host.iconUrl && <HostIcon src={host.iconUrl} alt={`${host.name}'s icon`} />}
                </TableCell>
                <TableCell>
                  {host.name}
                  <ChangeIndicator change={rankChange}>
                    {rankChange > 0 ? '↑' : rankChange < 0 ? '↓' : ''}
                  </ChangeIndicator>
                </TableCell>
                <TableCell>{host.viewers.toLocaleString()}</TableCell>
              </TableRow>
            );
          })}
        </tbody>
      </AnimatePresence>
    </RankingTable>
  );
}

export default HostRanking;