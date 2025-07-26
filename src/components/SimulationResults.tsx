import { Table, Text, Title, Stack, Card } from "@mantine/core";
import type { SimulationData } from "../lib/simulation.worker";

const ParkingResultsTable = ({ result }: { result: SimulationData }) => {
  const rows = Object.entries(result.data).map(([block, avgSpaces]) => (
    <Table.Tr key={block}>
      <Table.Td>{block} Block</Table.Td>
      <Table.Td>{avgSpaces.toFixed(2)}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3}>Simulation Results</Title>

        <Text size="sm" mt="sm">
          <strong>Odds of a spot on chosen block:</strong>{" "}
          {(result.oddsOfParkingAvailableOnBlock * 100).toFixed(1)}%
        </Text>
        <Text size="sm">
          <strong>Odds of a spot on adjacent block:</strong>{" "}
          {(result.oddsOfParkingAvailableOnAdjacentBlock * 100).toFixed(1)}%
        </Text>
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={4}>Average Available Spaces by Block</Title>

        <Table striped highlightOnHover withTableBorder mt="md">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Block</Table.Th>
              <Table.Th>Avg. Available Spaces</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Card>
    </Stack>
  );
};

export default ParkingResultsTable;
