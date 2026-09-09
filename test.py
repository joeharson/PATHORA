from tools.tavily_tool import tavily_search
from tools.flight_tool import search_flights
from backend import run_travel_itenary_agent


# results = tavily_search("Who is SANTHIYA JOE HARSON")
# print(results)

# results=search_flights("plan a 7 days Japan trip from Delhi") 
# print(results)


user_query = input("Enter your travel query: ")
response=run_travel_itenary_agent(user_input=user_query,thread_id="tesing001")
print("Final Response")
print(response["answer"])

