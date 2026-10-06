import os
import sys
from pathlib import Path

import certifi
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_mcp_adapters.client import MultiServerMCPClient


# Environment configuration

os.environ["SSL_CERT_FILE"] = certifi.where()
os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()

load_dotenv()

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")
AVIATION_STACK_API_KEY = os.getenv("AVIATIONSTACK_API_KEY")
GROQ_API_KEYS = os.getenv("GROQ_API_KEYS")  # Use GROQ_API_KEYS for multiple keys
OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")





# llm part 
llm = ChatGroq(
    model="openai/gpt-oss-20b",
    api_key=GROQ_API_KEYS)

client = MultiServerMCPClient(
    {
        "tavily": {
                    "transport": "streamable_http",
                    "url": f"https://mcp.tavily.com/mcp/?tavilyApiKey={TAVILY_API_KEY}"
                },

        "aviationstack": {
            "transport": "stdio",
            "command": "uvx",
            "args": [
                "aviationstack-mcp"
            ],
            "env": {
                "AVIATIONSTACK_API_KEY": AVIATION_STACK_API_KEY
            }
        },
        "weather": {
                    "transport": "stdio",
        
                    # Use the same Python environment that runs app.py.
                    "command": "python",
        
                    # Automatically use custom_weather_mcp_server.py
                    # from the current project directory.
                    "args": [
                        r"D:\\2)WORK AND FORUM\\learnings\\PATHORA\\custom_weather_mcp_server.py"
                    ],
        
                    "env": {
                        "OPENWEATHER_API_KEY": OPENWEATHER_API_KEY
                    }
        },
    }
)


async def get_all_tools():
    tools = await client.get_tools()
    print("\nAvailable MCP Tools:\n")

    for tool in tools:
        print(tool.name)











search_tool = None
aviation_tools = {}

async def initialize_mcp():

    global search_tool
    global aviation_tools

    if search_tool is not None and aviation_tools:
        return

    tools = await client.get_tools()

    print("\nAvailable MCP Tools:\n")

    for tool in tools:
        print(tool.name)

    search_tool = next(
        tool
        for tool in tools
        if tool.name == "tavily_search"
    )

    aviation_tools = {
        tool.name: tool
        for tool in tools
        if tool.name != "tavily_search"
    }


# This function can be used to call the tavily_search tool with a query in backend.py
async def tavily_mcp_search(query: str):
    await initialize_mcp()
    result = await search_tool.ainvoke(
        {
            "query": query
        }
    )
    return result
    # print(result)

async def aviation_mcp_call(tool_name: str, query: str):
    tool = await client.get_tools()
    tool = next(
        t for t in tool if t.name == tool_name)
    result = await tool.ainvoke(tool_args={})

    return result






### Weather MCP tools

weather_tool = None
forecast_tool = None

async def initialize_weather_tools():
    global weather_tool, forecast_tool
    
    if weather_tool is not None:
        return
        
    tools = await client.get_tools()
    
    weather_tool = next(
        t for t in tools
        if t.name == "get_current_weather"
    )
    
    forecast_tool = next(
        t for t in tools
        if t.name == "get_forecast"
    )

async def weather_mcp_search(city: str):
    await initialize_weather_tools()
    
    return await weather_tool.ainvoke(
        {
            "city": city
        }
    )

async def forecast_mcp_search(city: str):
    await initialize_weather_tools()
    
    return await forecast_tool.ainvoke(
        {
            "city": city
        }
    )




# ==========================================
# Destination extractor
# ==========================================

def extract_destination(query: str):
    prompt = f"""
    Extract only the destination city or country.

    Query:
    {query}

    Return only destination name.
    """

    response = llm.invoke(prompt)

    return response.content.strip()