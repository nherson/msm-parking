/// <reference lib="webworker" />

interface EventPayload {
  cars: number;
  percentageWillingToPay: number;
  simulations: number;
}

self.onmessage = function (event: MessageEvent<EventPayload>) {
  const { cars, percentageWillingToPay, simulations } = event.data;
  console.log("Event cars:", cars);
  console.log("Event percentageWillingToPay:", percentageWillingToPay);
  console.log("Event simulations:", simulations);
  console.log(new Simulator(200, 150, 0.5));
  const data = new Array<SimulationData>();
  // for (let w = 10; w < 30; w++) {
  //   const simulator = new Simulator(event.data.cars, 150, w / 100);
  //   data.push(simulator.run(10000));
  // }
  const simulator = new Simulator(cars, 150, percentageWillingToPay / 100); // TODO dont hardcode
  const results = simulator.run(simulations);
  console.log(results);
  self.postMessage({
    msg: "Worker finished",
    results: results,
  });
};

const FREE_PARKING_SPACES = 2900;
const MAX_PARKING_PER_BLOCK = 30;
const BLOCKS = ["200", "300", "400", "500", "600"];
// const DAYLIGHTING_SPACES_LOST = 15; // TODO incorporate
// const PARKLET_SPACES_LOST = 10; // TODO make configurable

interface SimulationRunResult {
  mainStreetParking: MainStreetParking;
  canParkOnTargetBlock: boolean;
  canParkOnAdjacentBlock: boolean;
}

export interface SimulationData {
  data: { [key: string]: number }; // average spots available on each block
  oddsOfParkingAvailableOnBlock: number;
  oddsOfParkingAvailableOnAdjacentBlock: number;
}

class Simulator {
  freeParkingSpaces: number;
  parkingSpacesOnMain: number;
  paidParkingWillingness: number;
  carsParked: number;

  constructor(
    carsParked: number, // cars currently parked on main (how busy it is)
    parkingSpacesOnMain: number,
    willingness: number
  ) {
    this.carsParked = carsParked;
    this.paidParkingWillingness = willingness;
    this.freeParkingSpaces = FREE_PARKING_SPACES;
    this.parkingSpacesOnMain = parkingSpacesOnMain;
  }

  run(times: number): SimulationData {
    const results = new Array<SimulationRunResult>();
    for (let i = 0; i < times; i++) {
      results.push(this.runOnce());
    }

    const availabilityPerBlock: { [block: string]: number } = {};
    BLOCKS.forEach((b) => (availabilityPerBlock[b] = 0));
    for (const block of BLOCKS) {
      for (const result of results) {
        availabilityPerBlock[block] +=
          result.mainStreetParking.availabilityOnBlock(block);
      }
    }
    BLOCKS.forEach(
      (b) =>
        (availabilityPerBlock[b] = availabilityPerBlock[b] / results.length)
    ); // normalize

    return {
      data: availabilityPerBlock,
      oddsOfParkingAvailableOnBlock:
        results.filter((item) => item.canParkOnTargetBlock).length /
        results.length,
      oddsOfParkingAvailableOnAdjacentBlock:
        results.filter((item) => item.canParkOnAdjacentBlock).length /
        results.length,
    };
  }

  runOnce(): SimulationRunResult {
    // Create a map of available parking on Main
    // TODO adjust for parklet and daylighting loss
    const mainStreetParking = new MainStreetParking();

    // Randomly distribute cars based on parameters
    for (let i = 0; i < this.carsParked; i++) {
      if (!this.willPayForParking()) {
        continue;
      }
      mainStreetParking.parkCar();
    }

    // Pick a random block to try to park on
    const targetBlock = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];

    return {
      mainStreetParking: mainStreetParking,
      canParkOnTargetBlock:
        mainStreetParking.availabilityOnBlock(targetBlock) > 0,
      canParkOnAdjacentBlock:
        mainStreetParking.availabilityOnAdjacentBlocks(targetBlock) > 0,
    };
  }

  private willPayForParking(): boolean {
    return Math.random() < this.paidParkingWillingness;
  }
}

class MainStreetParking {
  blocks: string[];
  // TODO Support number of spaces per block
  availability: Map<string, number>;

  // TODO dont use hardcoded constant values directly here?
  constructor() {
    this.blocks = BLOCKS;
    this.availability = new Map<string, number>();
    for (const block of BLOCKS) {
      this.availability.set(block, MAX_PARKING_PER_BLOCK);
    }
  }

  // Assigns a random desired block for a car, and attempts to
  // acquire a parking space either on that block or adjacent
  parkCar() {
    const targetBlockIdx = this.pickRandomBlockIdx();

    if (this.tryToParkOnBlockByIdx(targetBlockIdx)) {
      return; // able to park on target block
    }

    // Fallback to adjacent blocks
    var adjacentBlockIdxs = [targetBlockIdx - 1, targetBlockIdx + 1];
    // Randomize them
    if (Math.random() > 0.5) {
      adjacentBlockIdxs = [targetBlockIdx + 1, targetBlockIdx - 1];
    }

    // Try the first adjacent block
    if (this.tryToParkOnBlockByIdx(adjacentBlockIdxs[0])) {
      return;
    }
    // Finally, try the other adjacent block
    this.tryToParkOnBlockByIdx(adjacentBlockIdxs[1]);
  }

  availabilityOnBlock(blockName: string): number {
    return this.availability.get(blockName) || 0;
  }

  availabilityOnAdjacentBlocks(blockName: string): number {
    // convert name to idx
    let blockIdx: number = -1;
    for (var i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i] == blockName) {
        blockIdx = i;
        break;
      }
    }
    if (blockIdx == -1) {
      return 0; // shouldnt happen
    }

    let spaces = 0;
    [blockIdx - 1, blockIdx + 1].forEach((b: number) => {
      if (b >= 0 && b < this.blocks.length) {
        spaces += this.availabilityOnBlock(this.blocks[b]);
      }
    });
    return spaces;
  }

  private tryToParkOnBlockByIdx(idx: number): boolean {
    if (idx < 0 || idx >= this.blocks.length) {
      return false; // invalid block, so of course we cannot park there
    }
    const blockName = this.blocks[idx];

    const blockAvailability = this.availability.get(blockName);
    if (blockAvailability && blockAvailability > 0) {
      this.availability.set(blockName, blockAvailability - 1);
      return true;
    }
    return false;
  }

  private pickRandomBlockIdx(): number {
    return Math.floor(Math.random() * BLOCKS.length);
  }
}
