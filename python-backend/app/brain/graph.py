# FILE: app/brain/graph.py
# JOB: Connect the five nodes into one thinking loop.

from langgraph.graph import StateGraph, START, END
from app.brain.state import BrainState
from app.brain import nodes


# Build the graph using our state shape.
builder = StateGraph(BrainState)

# Add each node. The first name is a label; the second is the function.
builder.add_node("perceive", nodes.perceive)
builder.add_node("analyze", nodes.analyze)
builder.add_node("decide", nodes.decide)
builder.add_node("act", nodes.act)
builder.add_node("learn", nodes.learn)

# Connect them in a straight line.
# START -> perceive -> analyze -> decide -> act -> learn -> END
builder.add_edge(START, "perceive")
builder.add_edge("perceive", "analyze")
builder.add_edge("analyze", "decide")
builder.add_edge("decide", "act")
builder.add_edge("act", "learn")
builder.add_edge("learn", END)

# Compile the graph into something we can run.
brain_graph = builder.compile()