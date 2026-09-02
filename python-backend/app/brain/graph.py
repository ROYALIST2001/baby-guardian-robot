# FILE: app/brain/graph.py
# JOB: Connect the nodes, now with a branch for emergencies.

from langgraph.graph import StateGraph, START, END
from app.brain.state import BrainState
from app.brain import nodes


builder = StateGraph(BrainState)

# Add every node.
builder.add_node("perceive", nodes.perceive)
builder.add_node("analyze", nodes.analyze)
builder.add_node("decide", nodes.decide)
builder.add_node("act", nodes.act)
builder.add_node("emergency_act", nodes.emergency_act)   # new
builder.add_node("learn", nodes.learn)

# The start of the loop is always the same.
builder.add_edge(START, "perceive")
builder.add_edge("perceive", "analyze")

# NEW: a conditional edge. After analyze, we ask a question first.
# The routing function returns the NAME of the next node.
# The dictionary maps that name to the real node.
builder.add_conditional_edges(
    "analyze",                      # after this node
    nodes.route_after_analyze,      # run this function to choose
    {
        "emergency_act": "emergency_act",   # fast path
        "decide": "decide",                 # normal path
    }
)

# The normal path continues: decide -> act -> learn.
builder.add_edge("decide", "act")
builder.add_edge("act", "learn")

# The fast path skips decide and act, and goes straight to learn.
builder.add_edge("emergency_act", "learn")

# Both paths end at learn, so we always remember what happened.
builder.add_edge("learn", END)

brain_graph = builder.compile()