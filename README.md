# Real-time Chat Application Frontend

A modern real-time chat application frontend built with Angular 17, featuring real-time messaging and sentiment analysis visualization.

## Features

- Real-time messaging with SignalR
- Message sentiment visualization
- Responsive material design
- Message history with pagination
- Real-time typing indicators

## Tech Stack

- Angular 17.3.7
- @microsoft/signalr 8.0.0
- Angular Material
- TypeScript 5.4.2
- RxJS 7.8.0

## Quick Start

1. Install dependencies:
   ng install

2. Configure environment:
   Create src/environments/environment.ts with:
   - apiUrl: http://localhost:5000

3. Run development server:
   ng serve

Navigate to http://localhost:4200

## Build

For production:
ng build --configuration production

## Project Structure

src/
- app/
  - components/    # UI components
  - services/      # API services
  - models/        # Interfaces
  - shared/        # Shared utilities
- environments/    # Environment configs
- assets/         # Static files

## Environment Configuration

Development (environment.ts):
- production: false
- apiUrl: http://localhost:5000

Production (environment.prod.ts):
- production: true
- apiUrl: https://your-backend.azurewebsites.net

## Azure Deployment

1. Build the production version
2. Deploy to Azure Web App
3. Configure environment variables in Azure
4. Enable CORS in backend settings

## Development Commands

- ng serve - Start development server
- ng build - Build the application
