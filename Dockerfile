# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements.txt into the container
COPY requirements.txt .

# Install the required packages
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application into the container
COPY src .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["python3 ", " play.py -a policy_gradient -mn agent_a "]