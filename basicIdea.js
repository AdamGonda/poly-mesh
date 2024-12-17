class Simulation {
  constructor(controller, agents, proximityRadius = 10) {
    this.controller = controller; // Central brain to handle events
    this.agents = agents; // List of agents
    this.proximityRadius = proximityRadius; // Physical connection range
    this.interval = null; // Simulation loop interval
  }

  // Check if two agents are within proximity
  arePhysicallyClose(agentA, agentB) {
    const dx = agentA.x - agentB.x;
    const dy = agentA.y - agentB.y;
    return Math.sqrt(dx * dx + dy * dy) <= this.proximityRadius;
  }

  // Run the simulation
  run(stepInterval = 100) {
    this.interval = setInterval(() => {
      // Simulate agents emitting or receiving signals
      this.agents.forEach(agent => agent.update());

      // Check for proximity-based interactions
      for (let i = 0; i < this.agents.length; i++) {
        const emitter = this.agents[i];
        if (emitter.state === "E") {
          this.agents.forEach(receiver => {
            if (receiver !== emitter && receiver.state === "R" && this.arePhysicallyClose(emitter, receiver)) {
              receiver.receiveSignal(emitter.id); // Receiver reacts to the signal
            }
          });
        }
      }

      this.controller.displayState(); // Display the current state of connections
    }, stepInterval);
  }

  // Stop the simulation
  stop() {
    clearInterval(this.interval);
  }
}

class Agent {
  constructor(id, x, y, onEvent) {
    this.id = id; // Unique identifier
    this.x = x; // X-coordinate
    this.y = y; // Y-coordinate
    this.state = "E"; // Initial state (E = Emitting, R = Receiving)
    this.timeout = null; // Timeout for disconnection
    this.switchInterval = Math.random() * 1000 + 500; // Random interval to switch states
    this.onEvent = onEvent; // Event handler for signals
    this.lastSwitch = Date.now(); // Last state switch time
  }

  // Periodically switch states between Emitting (E) and Receiving (R)
  update() {
    const now = Date.now();
    if (now - this.lastSwitch >= this.switchInterval) {
      this.state = this.state === "E" ? "R" : "E";
      this.lastSwitch = now;
    }
  }

  // React to an incoming signal
  receiveSignal(emitterId) {
    if (!this.connected) {
      this.connected = true;
      this.onEvent({ type: "CONNECTED", id: this.id, to: emitterId });
      this.scheduleDisconnection(); // Start timeout for disconnection
    }
  }

  // Schedule disconnection if no further signals are received
  scheduleDisconnection() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.connected = false;
      this.onEvent({ type: "DISCONNECTED", id: this.id });
    }, 1000); // 1-second timeout
  }
}

class Controller {
  constructor() {
    this.connections = {}; // Track active connections
  }

  // Handle connection and disconnection events
  handleEvent(event) {
    if (event.type === "CONNECTED") {
      this.connections[event.id] = event.to;
      console.log(`Agent ${event.id} connected to ${event.to}.`);
    } else if (event.type === "DISCONNECTED") {
      delete this.connections[event.id];
      console.log(`Agent ${event.id} disconnected.`);
    }
  }

  // Display the current state of connections
  displayState() {
    console.log("Current connections:", this.connections);
  }
}

// Initialize the simulation
const controller = new Controller();

const agents = [
  new Agent("A", 0, 0, controller.handleEvent.bind(controller)),
  new Agent("B", 5, 5, controller.handleEvent.bind(controller)),
  new Agent("C", 9, 9, controller.handleEvent.bind(controller)) // Out of range initially
];

// Create the simulation with a proximity radius of 10 units
const simulation = new Simulation(controller, agents, 10);

// Run the simulation
simulation.run(100);

// Stop simulation after 10 seconds
setTimeout(() => {
  simulation.stop();
  controller.displayState();
}, 10000);
