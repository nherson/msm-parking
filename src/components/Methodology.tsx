import { Container, List, Modal, Text, Title } from "@mantine/core";

export function Methodology(props: { opened: boolean; onClose: () => void }) {
  return (
    <Modal size="lg" opened={props.opened} onClose={props.onClose}>
      <Container p="sm">
        <Title order={1} mb="md" ta="center">
          Methodology
        </Title>
        <Title order={2} my="sm">
          Overview
        </Title>
        <Text>
          Overview of what this simulator does. Everything here is a
          placeholder, TBD!
        </Text>
        <Title order={2} my="sm">
          Assumptions
        </Title>
        <Text>
          <List>
            <List.Item>Clone or download repository from GitHub</List.Item>
            <List.Item>Install dependencies with yarn</List.Item>
            <List.Item>
              To start development server run npm start command
            </List.Item>
            <List.Item>
              Run tests to make sure your changes do not break the build
            </List.Item>
            <List.Item>Submit a pull request once you are done</List.Item>
          </List>
        </Text>
        <Title order={2} my="sm">
          Data Sources
        </Title>
        <Text>
          <List>
            <List.Item>Clone or download repository from GitHub</List.Item>
            <List.Item>Install dependencies with yarn</List.Item>
            <List.Item>
              To start development server run npm start command
            </List.Item>
            <List.Item>
              Run tests to make sure your changes do not break the build
            </List.Item>
            <List.Item>Submit a pull request once you are done</List.Item>
          </List>
        </Text>
        <Title order={2} my="sm">
          Algorhythmic Walkthrough
        </Title>
        <Title order={2} my="sm">
          Disclaimers
        </Title>

        <Text>This is where the methodology will live</Text>
      </Container>
    </Modal>
  );
}
