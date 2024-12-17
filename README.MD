# poly-mesh

https://chatgpt.com/c/6752002e-026c-8006-ad09-5dd61aef871e

## Initial idea

The idea is to create a mesh of agents that can log via bluetooth when they are connected to an other agent's "side".
So we can create any game from the mesh, one example is a cube. 3x3x3 cube that you have to assemble by connecting cubes based on the color of their sides, and also connect to a phone that would direct the cubes to do stuff like change colors and so on. It would be an online multiplayer puzzle game with a real device.

There would be games like who can put together the mesh sooner, have penalty if one player is progressing to remove a piece from your mesh so you go back a step.

It could be levels so you don't need to put together the whole thing be scratch but get help, by limiting the active pieces, or have hits what to connect next based on light signals, like it will start lighting up so you know to use that part.

It can be time based, it can be diff shapes that has to be completed, it can be community driven what is the end shape it has to be.

## Technical details

We will have an agent model to think about this problem, so we have to determine what connected to what to know what is the current state of the mesh, and also we need to communicate back and forth to the agents and the device, like a phone, laptop or tablet.

The connection detection would be through a single connector of each side. 
So we will have an agent with 6 sides each with an id, so when they connect it can be communicated to the other party so it can know what they connected to then send this info to a central brain or to the device directly.

So this way we will have these connections that will alternate between TRANSMIT and RECEIVE modes in random intervals, then stay in that state for a random amount of time. So when they in a right combo a message can go through if one in E and the other in R with some corruption proof message protocol to count for disconnects and state changes. So when it's ideal the message will be interpreted and the agent will know at which side it received a message from and what other agent's side it is connected to. Then this can be communicated to the central brain or the device.

Which will be keeping the current connection state of the mesh in memory so it will know when the puzzle is done and conduct every other thing. Disconnection will be handled by this central brain simply just an invalidation threshold so if it's not receiving positive connection info from any agents or getting the new connection info that is newer and diff fo any old connection info it will update the connection state. 
