import { useState } from 'react'
import './App.css'
import { Container, Title, Stack, Slider, NumberInput, Button, Text } from '@mantine/core';
import { Simulator, type SimulationSummary } from './lib/simulation';

function App() {
  const [cars, setCars] = useState(500);
  const [percentageWillingToPay, setPercentageWillingToPay] = useState(50);
  const [simulations, setSimulations] = useState(10000);
  const [summary, setSummary] = useState<SimulationSummary | null>(null);

  const runSimulation = () => {
    // Simple placeholder simulation logic for now
    // const chance = simulateParking(500, 0.5, 10000);
    const simulator = new Simulator(cars, 150, percentageWillingToPay / 100)
    const summary = simulator.run(simulations)
    setSummary(summary);
  };

  return (
    <Container size="xs" style={{ padding: "2rem" }}>
      <Title order={1}>Main Street Parking:</Title>
      <Title order={2} c="gray" style={{ fontStyle: "italic" }}>"Theoretically Possible"</Title>
      <Text size="sm" my="lg">Critics of Ventura's pedestrian-friendly Main Street often cite parking, specifically wanting to park near the business they wish to patronize, as a reason to bring cars back. But is that a valid justification? To explore this, let's use a simple simulation.</Text>
      <Stack>
        <div>
          <Text>Number of cars downtown: {cars}%</Text>
          <Slider value={cars} onChange={setCars} min={0} max={2900} step={1} />
        </div>

        <div>
          <Text>Population willing to pay to park: {percentageWillingToPay}%</Text>
          <Slider value={percentageWillingToPay} onChange={setPercentageWillingToPay} min={0} max={100} step={1} />
        </div>

        <div>
          <Text>Number of Simulations</Text>
          <NumberInput value={simulations} onChange={(val) => setSimulations(Number(val) || 0)} />
        </div>

        <Button onClick={runSimulation} color="blue" size="md">
          Run Simulation
        </Button>

        {summary !== null && (
          <pre style={{ background: "#f4f4f4", padding: "10px", borderRadius: "4px" }}>
            {JSON.stringify(summary, null, 2)}
          </pre>
        )}
      </Stack>
    </Container>
  );
}

export default App
