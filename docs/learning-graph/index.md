# Learning Graph for Raspberry Pi Environmental Monitoring

This section contains the learning graph for this textbook. A learning graph is a
graph of concepts used in this textbook. Each concept is represented by a node in
a network graph. Concepts are connected by directed edges that indicate what
concepts each node depends on before that concept is understood by the student.

A learning graph is the foundational data structure for intelligent textbooks that
can recommend learning paths. A learning graph is like a roadmap of concepts to
help students arrive at their learning goals.

At the left of the learning graph are prerequisite or foundational concepts. They
have no outbound edges. They only have inbound edges from other concepts that
depend on understanding these foundational prerequisite concepts. At the far right
we have the most advanced concepts in the course. To master these concepts you
must understand all the concepts that they point to.

## This Graph At A Glance

| Property | Value |
|----------|-------|
| Concepts (nodes) | 269 |
| Dependencies (edges) | 463 |
| Taxonomy categories | 15 |
| Foundational concepts | 6 |
| Terminal concepts | 78 (29.0%) |
| Longest dependency chain | 14 |
| Average prerequisites per concept | 1.76 |
| Valid DAG | Yes, 0 cycles |
| Connected components | 1 |

The six foundational concepts — the places a reader can start with no prior
concept in this book — are Environmental Monitoring, Physical Property,
Atmosphere, Electromagnetic Spectrum, Fault, and Single Board Computer.

This graph is deliberately cross-linked between its seven measurement clusters
rather than built as seven parallel silos. Dew Point depends on Condensation,
Wind depends on Pressure Gradient, Diurnal Cycle depends on Solar Radiation, and
the Puy De Dome Experiment depends on Elevation. That structure encodes the
book's primary goal directly into the data: measurements drive one another, and
they drive consequences in the world.

Here are the other files used by the learning graph.

## Course Description

We use the [Course Description](../course-description.md) as the source document
for the concepts that are included in this course. The course description uses
the 2001 Bloom taxonomy to order learning objectives.

## List of Concepts

We use generative AI to convert the course description into a
[Concept List](./concept-list.md). Each concept is in the form of a short Title
Case label with all labels under 32 characters long.

## Concept Dependency List

We next use generative AI to create a Directed Acyclic Graph (DAG). DAGs do not
have cycles where concepts depend on themselves. We provide the DAG in two
formats. One is a [CSV file](learning-graph.csv) and the other format is a
[JSON file](learning-graph.json) that uses the vis-network JavaScript library
format. The vis-network format uses `nodes`, `edges` and `metadata` elements with
edges containing `from` and `to` properties. This makes it easy for you to view
and edit the learning graph using an editor built with the vis-network tools.

Edges point **from** a dependent concept **to** its prerequisite. An edge
`{from: 97, to: 96}` means "Dew Point depends on Relative Humidity."

## Analysis & Documentation

### Course Description Quality Assessment

This report rates the overall quality of the course description for the purpose
of generating a learning graph.

- Course description fields and content depth analysis
- Validates the course description has sufficient depth for generating 200 concepts
- Compares the course description against similar courses
- Identifies content gaps and strengths
- Suggests areas of improvement

**Result: 96/100 — Excellent.**

[View the Course Description Quality Assessment](course-description-assessment.md)

### Learning Graph Quality Validation

This report gives you an overall assessment of the quality of the learning graph.
It uses graph algorithms to look for specific quality patterns in the graph.

- Graph structure validation — all concepts are connected
- DAG validation (no cycles detected)
- Foundational concepts: 6 entry points
- Indegree distribution analysis
- Longest dependency chains
- Connectivity: percent of nodes connected to the main cluster

**Result: 89/100 — Good.**

[View the Learning Graph Quality Validation](quality-metrics.md)

### Concept Taxonomy

In order to see patterns in the learning graph, it is useful to assign colors to
each concept based on the concept type. We use generative AI to create about a
dozen categories for our concepts and then place each concept into a single
primary classifier.

- A concept classifier taxonomy with 15 categories
- Category organization — measurement foundations first, societal impact last
- Balanced categories (5.6% – 8.2% each)
- All categories under the 30% threshold
- Clear 3–6 letter abbreviations for use in the CSV file
- No Miscellaneous category was needed; every concept has a clear home

[View the Concept Taxonomy](concept-taxonomy.md)

### Taxonomy Distribution

This report shows how many concepts fit into each category of the taxonomy. Our
goal is a somewhat balanced taxonomy where each category holds an equal number of
concepts. We also don't want any category to contain over 30% of our concepts.

- Statistical breakdown
- Detailed concept listing by category
- Visual distribution table
- Balance verification

**Result: 2.6% spread between largest and smallest category.**

[View the Taxonomy Distribution Report](./taxonomy-distribution.md)

## Viewing the Graph

To render this graph as an interactive network diagram, run the `book-installer`
skill and choose the learning graph viewer guide. It creates a MicroSim at
`docs/sims/graph-viewer` that reads `learning-graph.json` and colors each node by
its taxonomy category.
