import { Card, Title } from "@mantine/core";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
  Legend,
} from "recharts";
import type { SimulationData } from "../lib/simulation.worker";

interface SimulationResultsProps {
  simulationData: SimulationData[];
}

const SimulationResults = ({ simulationData }: SimulationResultsProps) => {
  const graphData = simulationData.map((d) => ({
    willingnessToPayPercent: Math.round(d.willingnessToPayPercent * 100),
    probabilityOnBlock: d.oddsOfParkingAvailableOnBlock,
    probabilityAdjacentBlock: d.oddsOfParkingAvailableOnAdjacentBlock,
  }));
  return (
    <ResponsiveContainer width="100%" height={500}>
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Title order={3} mb="sm">
          Probability of Finding a Parking Spot
        </Title>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart margin={{ left: 20, top: 10, right: 10 }} data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="willingnessToPayPercent"
              label={{
                value: "Willingness to Pay for Parking (%)",
                position: "insideBottom",
                offset: -10,
                dx: -20,
                dy: 10,
              }}
              ticks={[10, 15, 20, 25, 30]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis
              tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
              label={{
                value: "Probability of Parking Space Available",
                angle: -90,
                position: "insideLeft",
                dy: 150,
                dx: -10,
              }}
            />
            <Tooltip
              formatter={(value: number) => `${(value * 100).toFixed(2)}%`}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                bottom: -390,
                position: "relative",
              }}
            />
            <Line
              type="monotone"
              dataKey="probabilityOnBlock"
              stroke="#4dabf7"
              strokeWidth={3}
              name="On Target Block"
            />
            <Line
              type="monotone"
              dataKey="probabilityAdjacentBlock"
              stroke="#82ca9d"
              strokeWidth={3}
              name="On Adjacent Block"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </ResponsiveContainer>
  );
};

export default SimulationResults;
