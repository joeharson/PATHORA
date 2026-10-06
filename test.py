import asyncio
# from mcp_client_test import get_all_tools, tavily_mcp_search
from MCP_Client_Testing import get_all_tools , tavily_mcp_search



if __name__ == "__main__":
    query = "Who is Santhiya Joe Harson"
    asyncio.run(tavily_mcp_search(query))