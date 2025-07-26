import { useState } from "react";
import "./App.css";
import {
  Container,
  Title,
  Stack,
  Slider,
  NumberInput,
  Button,
  Text,
  Anchor,
  Group,
} from "@mantine/core";
import SimulationResults from "./components/SimulationResults";
import { useDisclosure } from "@mantine/hooks";
import { Methodology } from "./components/Methodology";
import type { SimulationData } from "./lib/simulation.worker";

function App() {
  const [cars, setCars] = useState(500);
  const [percentageWillingToPay, setPercentageWillingToPay] = useState(50);
  const [simulations, setSimulations] = useState(10000);
  const [summary, setSummary] = useState<SimulationData | null>(null);
  const [showMethodology, { open: openMethodology, close: closeMethodology }] =
    useDisclosure(false);
  const [simulationRunning, setSimulationRunning] = useState(false);

  const runSimulation = () => {
    // Simple placeholder simulation logic for now
    console.log("starting simulator");
    setSimulationRunning(true);
    const worker = new Worker(
      new URL("./lib/simulation.worker.ts", import.meta.url),
      { type: "module" }
    );

    worker.onmessage = (event) => {
      console.log("onmessage block");
      console.log(event.data);
      setSummary(event.data.results);
      setSimulationRunning(false);
      worker.terminate(); // Clean up
    };

    worker.postMessage({
      cars: cars,
      percentageWillingToPay: percentageWillingToPay,
      simulations: simulations,
    });
    console.log("sent message");
  };

  return (
    <Container size="sm" style={{ padding: "2rem" }}>
      <Stack>
        <Title order={1}>Main Street Parking:</Title>
        <Title order={2} c="gray" style={{ fontStyle: "italic" }}>
          "Theoretically Possible"
        </Title>
        <Text size="sm">
          Critics of Ventura's pedestrian-friendly Main Street often cite
          parking, specifically wanting to park near the business they wish to
          patronize, as a reason to bring cars back. But is that a valid
          justification? To explore this, let's use a simple simulation.
        </Text>
        <Text size="sm">
          Use the inputs below to setup a hypothetical scenario in which you
          might wish to find a parking spot on Main Street. The site will run a
          simulation given the parameters and tell you what your odds might be
          of finding a parking spot. Use the buttons for some realistic preset
          values.
        </Text>
        <Text size="sm">
          Want to learn more? Checkout out the{" "}
          <Anchor onClick={openMethodology}>methodology</Anchor>.
        </Text>
        <Stack my="sm">
          <Text>Number of cars downtown: {cars}</Text>
          <Slider value={cars} onChange={setCars} min={0} max={2500} step={1} />
          <Group grow>
            <Button variant="filled" onClick={() => setCars(1000)}>
              Midweek <br />
              11AM
            </Button>
            <Button variant="filled" onClick={() => setCars(1100)}>
              Saturday
              <br />
              11AM
            </Button>
            <Button variant="filled" onClick={() => setCars(1150)}>
              Midweek
              <br />
              6PM
            </Button>
            <Button variant="filled" onClick={() => setCars(1450)}>
              Saturday
              <br />
              6PM
            </Button>
          </Group>
        </Stack>

        <Stack my="sm">
          <Text>
            Percent of drivers willing to pay to park: {percentageWillingToPay}%
          </Text>
          <Slider
            value={percentageWillingToPay}
            onChange={setPercentageWillingToPay}
            min={0}
            max={100}
            step={1}
          />
          <Group grow>
            <Button
              variant="filled"
              onClick={() => setPercentageWillingToPay(12)}
            >
              ParkMobile Survey
            </Button>
            <Button
              variant="filled"
              onClick={() => setPercentageWillingToPay(30)}
            >
              USDOT Figure
            </Button>
            <Button
              variant="filled"
              onClick={() => setPercentageWillingToPay(100)}
            >
              No Free Parking
            </Button>
          </Group>
        </Stack>

        <Stack my="sm">
          <Text>Number of Simulations</Text>
          <NumberInput
            value={simulations}
            onChange={(val) => setSimulations(Number(val) || 0)}
          />
        </Stack>

        <Button
          onClick={runSimulation}
          color="blue"
          size="md"
          loading={simulationRunning}
        >
          Run Simulation
        </Button>

        {summary !== null && (
          <Container size="md" style={{ padding: "2rem" }}>
            <SimulationResults result={summary} />
          </Container>
        )}
        <Methodology opened={showMethodology} onClose={closeMethodology} />
      </Stack>
    </Container>
  );
}

export default App;
