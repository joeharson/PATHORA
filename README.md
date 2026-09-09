# PATHORA

### AI-Powered Multi-Agent Travel Planner

PATHORA is an open-source AI travel planning system that transforms a natural-language travel request into a structured, personalized trip plan.

It uses a **multi-agent architecture built with LangGraph**, where specialized agents independently handle flight research, accommodation research, and itinerary planning before combining their results into a unified travel plan.

> **Plan less. Explore more.**

Use this link to try PathOra  https://pathora-alog.onrender.com/ 

---

## Overview

Planning a trip often requires searching across multiple platforms for flights, accommodation, destinations, and activities.

PATHORA brings these tasks into a single AI-powered workflow.

A user can simply provide a request such as:

```text
Plan a 7-day trip to Japan from Chennai for two people.

Budget: ₹2 lakh
Include: flights, hotels and sightseeing
Preference: balanced pace
```

PATHORA processes the request, delegates tasks to specialized agents, researches relevant information, and generates a consolidated travel plan.

---

## Key Capabilities

- **Flight Research** — Retrieves flight-related information using AviationStack.
- **Accommodation Research** — Uses Tavily to research hotels and travel information.
- **Itinerary Generation** — Produces structured day-by-day travel plans.
- **Multi-Agent Orchestration** — Coordinates specialized agents using LangGraph.
- **Natural-Language Input** — Accepts travel requests without rigid forms.
- **Persistent Conversations** — Stores conversation state using PostgreSQL.
- **API Backend** — Provides travel planning APIs through FastAPI.
- **Observability** — Supports LangSmith tracing for monitoring and debugging.
- **Web Interface** — Provides a simple interface for submitting travel requests and viewing generated plans.

---

## Architecture

PATHORA separates travel planning into independent responsibilities:

```text
                    Travel Request
                          |
                          v
                 +------------------+
                 | Travel Planner    |
                 +--------+---------+
                          |
            +-------------+-------------+
            |             |             |
            v             v             v
       Flight Agent   Stay Agent   Itinerary Agent
            |             |             |
            +-------------+-------------+
                          |
                          v
                 +------------------+
                 | Final Travel Plan |
                 +------------------+
```

The workflow is orchestrated using **LangGraph**, allowing individual agents to be developed, tested, and extended independently.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Python | Core application |
| LangGraph | Multi-agent workflow orchestration |
| LangChain | LLM and agent components |
| Groq | LLM inference |
| FastAPI | Backend API |
| PostgreSQL | Conversation and state persistence |
| Tavily | Web-based travel research |
| AviationStack | Flight information |
| LangSmith | Tracing and observability |
| HTML / CSS / JavaScript | Web interface |
| uv | Dependency and environment management |

---

## Getting Started

### Prerequisites

Make sure you have:

- Python 3.10+
- [uv](https://docs.astral.sh/uv/)
- PostgreSQL
- Groq API key
- Tavily API key
- AviationStack API key

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/pathora-ai-travel-agent.git
cd pathora-ai-travel-agent
```

Install dependencies:

```bash
uv sync
```

### Environment Variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
DATABASE_URL=your_database_url
TAVILY_API_KEY=your_tavily_api_key
AVIATIONSTACK_API_KEY=your_aviationstack_api_key

DEFAULT_ORIGIN_IATA=your_origin_iata_code

LANGSMITH_API_KEY=your_langsmith_api_key
LANGSMITH_TRACING=true
LANGSMITH_ENDPOINT=https://api.smith.langchain.com
LANGSMITH_PROJECT=your_project_name
```

LangSmith configuration is optional.

Keep your `.env` file private and never commit API keys to the repository.

---

## Running the Application

Start the FastAPI server:

```bash
uv run python app.py
```

Open the application at:

```text
http://127.0.0.1:8000/
```

---

## API

### Health Check

```http
GET /health
```

### Generate Travel Plan

```http
POST /api/travel
```

Example request:

```bash
curl -X POST http://127.0.0.1:8000/api/travel \
  -H "Content-Type: application/json" \
  -d '{"message":"Plan a 5-day trip to Japan from Chennai for two people"}'
```

The API returns the generated travel plan along with conversation thread information.

---

## Why Multi-Agent Architecture?

Travel planning involves several different types of reasoning and external information.

Flight research, accommodation discovery, and itinerary generation have different requirements and can evolve independently.

PATHORA separates these responsibilities into specialized agents, making the system:

- Easier to extend
- Easier to debug
- Easier to maintain
- Better suited for adding new capabilities
- More flexible than a single-agent workflow

New agents can be added without redesigning the entire system.

---

## Future Scope

PATHORA can be extended with:

- Real-time flight price comparison
- Train and bus planning
- Restaurant discovery
- Weather-aware itineraries
- Budget optimization
- Visa and travel-document assistance
- Map-based route planning
- Hotel availability
- Booking integrations
- Additional specialized travel agents

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Test the changes
5. Open a pull request

---

## License

This project is open source. See the repository's `LICENSE` file for details.

---

## Acknowledgements

PATHORA was built as a practical exploration of:

- Large Language Model applications
- LangChain and LangGraph
- Multi-agent systems
- API integration
- Agentic workflows
- Persistent AI applications

The project demonstrates how specialized AI agents and external data sources can be combined to solve a practical planning problem.